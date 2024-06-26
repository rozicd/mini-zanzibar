using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RBSBack.Models
{
    public class PaginationReturnObject<T>
    {
        public IEnumerable<T> Items { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }

        public PaginationReturnObject(IEnumerable<T> items, int pageNumber, int pageSize, int totalItems)
        {
            Items = items;
            Page = pageNumber;
            PageSize = pageSize;
            TotalItems = totalItems;
        }

    }
}