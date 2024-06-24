using RBSBack.DTOS.Requests;
using RBSBack.Models;
using RBSBack.Repositories;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace RBSBack.Services
{
    public class NoteService : INoteService
    {
        private readonly INoteRepository _noteRepository;
        private readonly IUserRepository _userRepository;
        private readonly HttpClient _httpClient;

        public NoteService(INoteRepository noteRepository, IUserRepository userRepository, HttpClient httpClient)
        {
            _noteRepository = noteRepository;
            _userRepository = userRepository;
            _httpClient = httpClient;
        }

        public async Task<Note> CreateNoteAsync(CreateNoteDTO note, string username)
        {
            Note createdNote = new Note
            {
                Id = Guid.NewGuid(),
                Name = note.Name,
                NameSpace = note.NameSpace,
                Text = note.Text
            };

            createdNote = await _noteRepository.Add(createdNote);

            var aclData = new
            {
                @object = $"{createdNote.NameSpace}:{createdNote.Name}",
                relation = "owner",
                user = $"user:{username}"
            };
            await _httpClient.PostAsJsonAsync("http://localhost:5000/acl", aclData);

            return createdNote;
        }

        public async Task<Note> GetNoteByIdAsync(Guid id, string username)
        {
            var note = await _noteRepository.GetById(id);
            if (note == null) return null;

            var aclCheckResult = await CheckAclAsync(note.NameSpace, note.Name, "viewer", username);
            if (!aclCheckResult) throw new UnauthorizedAccessException("User does not have viewer access.");

            return note;
        }

        public async Task<PaginationReturnObject<NoteReturnDTO>> GetAllNotesAsync(int pageNumber, int pageSize)
        {
            var paginationNotes = await _noteRepository.GetAll(pageNumber, pageSize);

            var paginatedReturnNote = new PaginationReturnObject<NoteReturnDTO>(
                new List<NoteReturnDTO>(),
                pageNumber,
                pageSize,
                paginationNotes.TotalItems
            );

            paginatedReturnNote.Items = paginationNotes.Items.Select(item => new NoteReturnDTO
            {
                Id = item.Id,
                Name = item.Name,
                NameSpace = item.NameSpace
            }).ToList();

            return paginatedReturnNote;
        }

        public async Task<Note> UpdateNoteAsync(Guid id, UpdateNoteDTO note, string username)
        {
            var existingNote = await _noteRepository.GetById(id);
            if (existingNote == null) return null;

            var aclCheckResult = await CheckAclAsync(existingNote.NameSpace, existingNote.Name, "editor", username);
            if (!aclCheckResult) throw new UnauthorizedAccessException("User does not have editor access.");

            existingNote.Text = note.Text;

            return await _noteRepository.Update(id, note.Text);
        }

        public async Task ShareNoteAsync(Guid noteId, string currentUsername, string targetUsername, string relation)
        {
            var note = await _noteRepository.GetById(noteId);
            if (note == null)
                throw new Exception("Note not found");

            var hasAccess = await CheckAclAsync(note.NameSpace, note.Name, "owner", currentUsername);
            if (!hasAccess)
                throw new UnauthorizedAccessException("You do not have permission to share this note");

            var isValidRole = await IsValidRoleAsync(note.NameSpace, relation);
            if (!isValidRole)
                throw new Exception("Invalid role");

            var userExists = await _userRepository.GetByEmail(targetUsername);

            var aclData = new
            {
                @object = $"{note.NameSpace}:{note.Name}",
                relation,
                user = $"user:{targetUsername}"
            };
            await _httpClient.PostAsJsonAsync("http://localhost:5000/acl", aclData);
        }

        private async Task<bool> IsValidRoleAsync(string nameSpace, string relation)
        {
            var response = await _httpClient.GetAsync($"http://localhost:5000/namespace/{nameSpace}/roles");
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                var rolesResponse = JsonConvert.DeserializeObject<RolesResponse>(result);
                return rolesResponse.Roles.Contains(relation);
            }
            return false;
        }

        private async Task<List<String>> getNameSpaceRoles(String nameSpace)
        {
             var response = await _httpClient.GetAsync($"http://localhost:5000/namespace/{nameSpace}/roles");
            List<String> roles = new List<String>();
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                var rolesResponse = JsonConvert.DeserializeObject<RolesResponse>(result);
                roles = rolesResponse.Roles;
            }
            return roles;


    }

    private async Task<bool> CheckAclAsync(string nameSpace, string name, string relation, string username)
        {
            var response = await _httpClient.GetAsync($"http://localhost:5000/acl/check?object={nameSpace}:{name}&relation={relation}&user=user:{username}");
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                var aclCheckResult = JsonConvert.DeserializeObject<dynamic>(result);
                return aclCheckResult.authorized;
            }
            return false;
        }

        public async Task<bool> IsOwner(Guid id, LoggedUser user)
        {
            var note = await _noteRepository.GetById(id);
            if (note == null)
                throw new Exception("Note not found");

            return await CheckAclAsync(note.NameSpace, note.Name, "owner", user.Email);


        }

        public async  Task<List<string>> GetRoles(Guid id)
        {
            var note = await _noteRepository.GetById(id);
            if (note == null)
                throw new Exception("Note not found");

            List<String> roles = await  getNameSpaceRoles(note.NameSpace);

            return roles;
        }
    }
}
