//A component that display a text box using

//import { useState } from "react"
import { Rating } from "@mui/material"
import { Typography } from "@mui/joy"
import { Comment } from "./Comment"


export const Comments = () => {

    //const [rating, setRating] = useState<number>(0)

    const comments = [
        {
            user: 'Jane Smith',
            comment: 'Another great comment!',
            date: 'October 27, 2023',
        },
        {
            user: 'Sam Smith',
            comment: 'Another great comment!',
            date: 'October 27, 2023',
        },
        {
            user: 'Taylor Johnson',
            comment: 'Another great comment!',
            date: 'October 27, 2023',
        },
        {
            user: 'Abigail Wayne',
            comment: 'Another great comment!',
            date: 'October 27, 2023',
        },
        {
            user: 'Jane Smith',
            comment: 'Another great comment!',
            date: 'October 27, 2023',
        }
    ]

    return <div className="flex flex-col gap-3 mt-10">

        <Typography level="h3">Opinones del producto</Typography>
        <div className="grid grid-cols-[20%_80%]">
            <Typography level="title-lg">Calidad</Typography>
            <Rating value={4.5} readOnly />
            <Typography level="title-lg">Diseño</Typography>
            <Rating value={4.5} readOnly />
            <Typography level="title-lg">Usabilidad</Typography>
            <Rating value={4.5} readOnly />
        </div>
        <div>
            <Typography level="h4">Opiniones</Typography>
            <div className="mt-2">
                {
                    comments.map(c => <Comment comment={c.comment} date={c.date} user={c.user} />)
                }
            </div>
        </div>

    </div>
}