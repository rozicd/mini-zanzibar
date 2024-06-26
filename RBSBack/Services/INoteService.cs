using RBSBack.DTOS.Requests;
using RBSBack.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RBSBack.Services
{
    public interface INoteService
    {
        Task<Note> CreateNoteAsync(CreateNoteDTO note, string username);
        Task<Note> GetNoteByIdAsync(Guid id, string username);
        Task<PaginationReturnObject<NoteReturnDTO>> GetAllNotesAsync(int pageNumber, int pageSize);
        Task<Note> UpdateNoteAsync(Guid id,UpdateNoteDTO note, string username);
        Task ShareNoteAsync(Guid noteId, string currentUsername, string targetUsername, string relation);
        Task<bool> IsOwner(Guid id,LoggedUser user);
        Task<List<string>> GetRoles(Guid id);
        Task<bool> CreateNamespace(string content);
        Task<bool> SwitchNamespaceAsync(string version);
        Task<string> GetActiveVersionAsync();

        Task<List<string>> GetAllNamespaceVersionsAsync();
    }
}