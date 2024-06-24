// NotesController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RBSBack.DTOS.Requests;
using RBSBack.Models;
using RBSBack.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace RBSBack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotesController : BaseController
    {
        private readonly INoteService _noteService;

        public NotesController(INoteService noteService) : base()
        {
            _noteService = noteService;
        }

        [HttpGet]
        [Authorize(Roles = "USER")]
        public async Task<ActionResult<PaginationReturnObject<NoteReturnDTO>>> GetAllNotes([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var paginationObject = await _noteService.GetAllNotesAsync(pageNumber, pageSize);
            return Ok(paginationObject);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "USER")]
        public async Task<ActionResult<Note>> GetNoteById(Guid id)
        {
            var note = await _noteService.GetNoteByIdAsync(id,_user.Email);
            if (note == null)
            {
                return NotFound();
            }
            return Ok(note);
        }

        [HttpGet("is-owner/{id}")]
        public async Task<bool> isOwner(Guid id)
        {
            if (await _noteService.IsOwner(id,_user))
            {
                return true;
            }
            return false;


        }

        [HttpGet("note-roles/{id}")]
        public async Task<List<String>> noteRoles(Guid id)
        {
            List<String> roles = await _noteService.GetRoles(id);

            return roles;


        }

        [HttpPost]
        [Authorize(Roles = "USER")]
        public async Task<ActionResult<Note>> CreateNote(CreateNoteDTO note)
        {
            var createdNote = await _noteService.CreateNoteAsync(note, _user.Email);
            return CreatedAtAction(nameof(GetNoteById), new { id = createdNote.Id }, createdNote);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "USER")]
        public async Task<ActionResult<Note>> UpdateNote(Guid id, UpdateNoteDTO note)
        {
            var updatedNote = await _noteService.UpdateNoteAsync(id,note, _user.Email);
            if (updatedNote == null)
            {
                return NotFound();
            }
            return Ok(updatedNote);
        }


        [HttpPost("{id}/share")]
        [Authorize(Roles = "USER")]
        public async Task<IActionResult> ShareNote(Guid id, ShareNoteDTO shareNoteDTO)
        {
            try
            {
                await _noteService.ShareNoteAsync(id, _user.Email, shareNoteDTO.TargetUsername, shareNoteDTO.Relation);
                return Ok();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("/namespace")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CreateNamespace([FromForm] CreateNamespaceDTO createNamespaceDTO)
        {
            if (createNamespaceDTO == null)
            {
                return BadRequest(new { message = "Invalid input" });
            }



            var jsonContent = JsonConvert.SerializeObject(createNamespaceDTO.Json);

            var response = await _noteService.CreateNamespace(createNamespaceDTO.Json);
            if (response)
            {
                return Ok();
            }
            return BadRequest(new { message = "invalid input" });

            
        }
    }
}
