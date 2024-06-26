// NoteRepository.cs
using Microsoft.EntityFrameworkCore;
using RBSBack.Exceptions;
using RBSBack.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RBSBack.Repositories
{
    public class NoteRepository : INoteRepository
    {
        private readonly DbSet<Note> _notes;
        private readonly DatabaseContext _context;

        public NoteRepository(DatabaseContext context)
        {
            _context = context;
            _notes = context.Set<Note>();
        }

        public async Task<Note> Add(Note note)
        {
            var existingNOte = await _notes.FirstOrDefaultAsync(n => n.Name == note.Name);
            if (existingNOte != null)

            {
                throw new EmailAlreadyExistException("Note with that name already exists!");
            }
            note.Id = Guid.NewGuid();
            await _notes.AddAsync(note);
            await _context.SaveChangesAsync();
            return note;
        }

        public async Task<Note> GetById(Guid id)
        {
            var note = await _notes.FirstOrDefaultAsync(n => n.Id == id);
            if (note == null)
            {
                throw new ResourceNotFoundException("Note not found");
            }
            return note;
        }

        public async Task<PaginationReturnObject<Note>> GetAll(int pageNumber, int pageSize)
        {
            var totalCount = await _notes.CountAsync();
            var pagedNotes = await _notes.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PaginationReturnObject<Note>(pagedNotes, pageNumber, pageSize, totalCount);
        }

        public async Task<Note> Update(Guid id, String text)
        {
            var note = await _notes.FirstOrDefaultAsync(n => n.Id == id);
            if (note == null)
            {
                throw new ResourceNotFoundException("Note not found");
            }

            note.Text = text;

            _context.Update(note);
            await _context.SaveChangesAsync();

            return note;
        }
    }
}
