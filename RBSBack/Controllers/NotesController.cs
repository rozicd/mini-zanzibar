// NotesController.cs
using Microsoft.AspNetCore.Mvc;
using RBSBack.DTOS.Requests;
using RBSBack.Models;
using RBSBack.Services;
using System;
using System.Collections.Generic;
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
        public async Task<ActionResult<PaginationReturnObject<NoteReturnDTO>>> GetAllNotes([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var paginationObject = await _noteService.GetAllNotesAsync(pageNumber, pageSize);
            return Ok(paginationObject);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Note>> GetNoteById(Guid id)
        {
            var note = await _noteService.GetNoteByIdAsync(id,_user.Email);
            if (note == null)
            {
                return NotFound();
            }
            return Ok(note);
        }

        [HttpPost]
        public async Task<ActionResult<Note>> CreateNote(CreateNoteDTO note)
        {
            var createdNote = await _noteService.CreateNoteAsync(note, _user.Email);
            return CreatedAtAction(nameof(GetNoteById), new { id = createdNote.Id }, createdNote);
        }

        [HttpPut("{id}")]
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
    }
}
