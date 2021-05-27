const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    let finished = false;

    if(pageCount===readPage){
        finished = true;
    }
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    
    if(name === undefined){
        const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;   
    }else if(readPage > pageCount){
        const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }else{
        const newBook = {
            id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
        };
        
        books.push(newBook);
        const isSuccess = books.filter((book) => book.id === id).length > 0;
        if (isSuccess) {
            const response = h.response({
              status: 'success',
              message: 'Buku berhasil ditambahkan',
              data: {
                BookId: id,
              },
            });
            response.code(201);
            return response;
        }else{
            const response = h.response({
            status: 'fail',
            message: 'Buku gagal ditambahkan',
            });
            response.code(500);
            return response;
        }
    }     

};

const getAllBooksHandler = (request, h) => {
    const { reading, finished, name } = request.query;
    let filteredBooks = books;

    if (reading !== undefined) {
        if(reading == 1){
            filteredBooks = filteredBooks.filter((book) => book.reading == true);
        }else if(reading == 0){
            filteredBooks = filteredBooks.filter((book) => book.reading == false); 
        }else{

        }
    }
    if (finished !== undefined) {
        if(finished == 1){
            filteredBooks = filteredBooks.filter((book) => book.finished == true);
        }else if(finished == 0){
            filteredBooks = filteredBooks.filter((book) => book.finished == false);
        }else{

        }        
    }
    if (name !== undefined) {
        filteredBooks = filteredBooks.filter((book) =>
            book.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    filteredBooks = filteredBooks.map((book) => {
        const { id, name, publisher } = book;
        return { id, name, publisher };
    });
    const response = h.response({
        status: "success",
        data: {
            books: filteredBooks,
        },
    });

    response.code(200);
    return response;   
    
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
   
    const book = books.filter((b) => b.id === bookId)[0];
   
   if (book !== undefined) {
    const response = h.response({
        status: 'success',
        data: {
          book,
        },
      });
      response.code(200);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};


const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const {name,year,author,summary,publisher,pageCount,readPage,reading} = request.payload;
    const updatedAt = new Date().toISOString();

    if(name === undefined){
        const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }else if(readPage > pageCount){
        const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }else{
        const index = books.findIndex((book) => book.id === bookId);

        if (index !== -1) {
            books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
            };
        
            const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
            });
            response.code(200);
            return response;
        }else{
            const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
            });
            response.code(404);
            return response;
        }
    }   
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
   
    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;
  };

module.exports = {addBookHandler,getAllBooksHandler,getBookByIdHandler,editBookByIdHandler,deleteBookByIdHandler };