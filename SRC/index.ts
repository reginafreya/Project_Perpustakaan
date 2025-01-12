import express from 'express'
import cors from 'cors'
import routerBuku from './Router/routerBuku'
import routerUser from './Router/routerUser'
import routerPeminjaman from './Router/routerPeminjaman'

const PORT: number = 8000
const app = express()
app.use(cors())

app.use('/buku', routerBuku)
app.use('/user', routerUser)
app.use('/transaksi',routerPeminjaman)

app.listen(PORT,() => {
    console.log(`[server]: Server is running at http:localhost:${PORT}`)
})