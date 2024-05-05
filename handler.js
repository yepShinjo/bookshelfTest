const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    console.log('Request Payload:', request.payload)
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        const resp = h.response({
            status: 'fail',
            message: "Gagal menambahkan buku. Mohon isi nama buku"
        })
        resp.code(400);
        return resp;
    }

    if (readPage > pageCount) {
        const resp = h.response({
            status: 'fail',
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        })
        resp.code(400);
        return resp;
    }

    if(!Number.isInteger(parseInt(year, 10))) {
        const resp = h.response({
            status: 'fail',
            message: "Gagal menambahkan buku. Tahun harus berupa angka bulat"
        })
        resp.code(400)
        return resp;
    }

    if(!Number.isInteger(parseInt(pageCount, 10))) {
        const resp = h.response({
            status: 'fail',
            message: "PageCount harus berupa bilangan bulat"
        })
        resp.code(400)
        return resp;
    }

    if(!Number.isInteger(parseInt(readPage, 10))) {
        const resp = h.response({
            status: 'fail',
            message: "ReadPage harus berupa bilangan bulat"
        })
        resp.code(400)
        return resp;
    }

    const bookId = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = readPage === pageCount;

    const newBook = {
        bookId,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    };
    books.push(newBook);

    const isSuccess = books.filter((book) => book.bookId === bookId).length > 0;
    if (isSuccess) {
        const resp = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId,
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                finished,
                reading,
                insertedAt,
                updatedAt
            },
        });
        resp.code(201);
        return resp;
    }

    const resp = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    resp.code(500);
    return resp;
};

const getAllBooksHandler = () => ({
    status: 'success',
    data: {
        books: books.map(book => ({
            id: book.bookId,
            name: book.name,
            publisher: book.publisher
        }))
    },
});

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.bookId === bookId)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book: {
                    id: book.bookId,
                    ...book,
                }
            },
        };
    }
    const resp = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    resp.code(404);
    return resp;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        const resp = h.response({
            status: 'fail',
            message: "Gagal memperbarui buku. Mohon isi nama buku"
        })
        resp.code(400);
        return resp;
    }

    if (readPage > pageCount) {
        const resp = h.response({
            status: 'fail',
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        })
        resp.code(400);
        return resp;
    }

    if(!Number.isInteger(parseInt(year, 10))) {
        const resp = h.response({
            status: 'fail',
            message: "Gagal memperbarui buku. Tahun harus berupa angka bulat"
        })
        resp.code(400)
        return resp;
    }

    if(!Number.isInteger(parseInt(pageCount, 10))) {
        const resp = h.response({
            status: 'fail',
            message: "PageCount harus berupa bilangan bulat"
        })
        resp.code(400)
        return resp;
    }

    if(!Number.isInteger(parseInt(readPage, 10))) {
        const resp = h.response({
            status: 'fail',
            message: "ReadPage harus berupa bilangan bulat"
        })
        resp.code(400)
        return resp;
    }

    console.log('Request Payload:', request.payload);

    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.bookId === bookId);
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
        const resp = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        resp.code(200);
        return resp;
    }
    const resp = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    resp.code(404);
    return resp;
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const resp = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        resp.code(200);
        return resp;
    }
    const resp = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    resp.code(404);
    return resp;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};