using RBSBack.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RBSBack.Repositories
{
    public interface INoteRepository
    {
        Task<Note> Add(Note note);
        Task<Note> GetById(Guid id);
        Task<PaginationReturnObject<Note>> GetAll(int pageNumber, int pageSize);
        Task<Note> Update(Guid id,String text);
    }
}
