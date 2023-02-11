import next, { GetServerSideProps, NextPage } from "next"

import Footer from "../../../components/Footer"
import Header from "../../../components/Header"

import prisma from "../../../components/Client"
import { MdOutlineClass, MdSubject } from "react-icons/md"
import { AiOutlineClockCircle } from "react-icons/ai"
import StudentItem from "../../../components/StudentItem"
import ExistingStudentItem from "../../../components/ExistingStudentItem"
import { useEffect, useState } from "react"
import { BsGenderMale, BsGenderFemale, BsFilterSquare } from "react-icons/bs"

type course = {
    id: string,
    title: string,
    subject: string,
    year: number,
    created: string,
    quantityValue: number,
}

type student = {
    id: string,
    name: string,
    sirname: string,
    dateOfBirth: string,
    gender: number,
    visuals: number,
}

type answer = {
    studentId: string
    quality: number
}

type annotation = {
    studentId: string
    type: number
}

type props = {
    course: course,
    students: student[]
    answers: answer[]
    annotations: annotation[]
}

const Course: NextPage<props> = ({course, students, answers, annotations}) => {

    const created = new Date(parseInt(course.created))
    const [studentData, setStudentData] = useState<{student: student, rating: number}[]>([])

    const [filterMenuOpen, setFilterMenuOpen] = useState<boolean>(false)
    const [filterMenuValue, setFilterMenuValue] = useState<number>(1)

    const calculateStudentRatings = () => {
        const studentsWithRatings: {student: student, rating: number}[] = []

        // how important is quantity and quality?
        const quantityValue = course.quantityValue / 100
        const qualityValue = 1 - quantityValue

        students.map(student => {
            // get answers and annotations of the student
            const answersOfStudent = answers.filter((answer: answer) => answer.studentId == student.id)
            const annotationsOfStudent = annotations.filter((annotation: annotation) => annotation.studentId == student.id)

            // calculate avg answer quality
            let averageAnswerQuality = 0
            if(answersOfStudent.length > 0) {
                averageAnswerQuality = answersOfStudent.reduce((totalQuality, nextAnswer) => totalQuality + nextAnswer.quality, 0) / answersOfStudent.length
            }

            // calculate partial rating
            let rating = Math.ceil(averageAnswerQuality * qualityValue + answersOfStudent.length * 2 * quantityValue)

            // finish calculating rating 
            annotationsOfStudent.map(annotation => annotation.type == 0 ? rating++ : rating--)

            studentsWithRatings.push({student: student, rating: rating})
        })

        if(filterMenuValue == 1) {
            // sort by name
            studentsWithRatings.sort((a,b) => a.student.sirname.localeCompare(b.student.sirname))
        } else if(filterMenuValue == 2) {
            // sort by rating
            studentsWithRatings.sort((a,b) => b.rating - a.rating)
        }

        setStudentData([...studentsWithRatings])
    }

    useEffect(() => {
        calculateStudentRatings()
    }, [filterMenuValue])

    return (
        <div className="min-h-screen flex flex-col justify-between space-y-10">
            <Header />

            <main className="flex flex-col items-center justify-center">
                <div className="max-w-lg md:max-w-2xl lg:max-w-4xl w-full flex flex-col items-center justify-center">
                    <div className="w-full text-4xl text-blue-400 border-b border-zinc-500 px-4 text-center md:text-left md:mx-4 py-2 flex flex-col items-left justify-center">
                        <h1>{course.title}</h1>
                        <div className="flex flex-row items-center justify-start text-stone-800 text-sm space-x-2">
                            <div className="flex flex-row items-center justify-center space-x-1"><MdSubject className="w-4 h-4 mr-1" /> {course.subject}</div>
                            <div className="flex flex-row items-center justify-center space-x-1"><MdOutlineClass className="w-4 h-4 mr-1" /> Jahrgang {course.year}</div>
                            <div className="flex flex-row items-center justify-center space-x-1">
                                <AiOutlineClockCircle className="w-4 h-4" />
                                <div className="flex flex-row items-left justify-center">
                                    Erstellt am 
                                    <p className="ml-1">{created.getDate() < 10 ? "0" : ""}{created.getDate()}.</p>
                                    <p>{created.getMonth() + 1 < 10 ? "0" : ""}{created.getMonth() + 1}.</p>
                                    <p>{created.getFullYear()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full max-w-2xl flex flex-col items-center justify-center mt-10 space-y-10 px-4">
                        <div className="w-full bg-white flex flex-col items-center justify-center border border-zinc-500 rounded-md !mt-10 p-3 relative">

                            <div className="w-full flex flex-col items-center justify-center space-y-2 border-b border-zinc-500 pb-1 mx-4 text-stone-800">
                                <h1 className="text-center text-2xl font-md">Schüler in diesem Kurs</h1>

                                <button onClick={() => setFilterMenuOpen(!filterMenuOpen)} className="flex flex-row items-center justify-center space-x-1 cursor-pointer">
                                    <BsFilterSquare />
                                    <p>Filter</p>
                                </button>

                                <div className={`w-full flex flex-row items-center justify-between space-x-2 !mb-2 transition-all duration-300 ${filterMenuOpen ? "" : "opacity-0 -translate-y-10 absolute"}`}>
                                    <button onClick={() => setFilterMenuValue(0)} className={`w-full border border-zinc-500 rounded-3xl ${filterMenuValue == 0 ? "bg-blue-500 text-slate-50 border-slate-50" : "hover:bg-slate-50"}`}>Nicht geordnet</button>
                                    <button onClick={() => setFilterMenuValue(1)} className={`w-full border border-zinc-500 rounded-3xl ${filterMenuValue == 1 ? "bg-blue-500 text-slate-50 border-slate-50" : "hover:bg-slate-50"}`}>Nach Name</button>
                                    <button onClick={() => setFilterMenuValue(2)} className={`w-full border border-zinc-500 rounded-3xl ${filterMenuValue == 2 ? "bg-blue-500 text-slate-50 border-slate-50" : "hover:bg-slate-50"}`}>Nach Rating</button>
                                </div>
                            </div>
                            
                            <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5">
                                {/* List all of the students */}
                                {
                                    students.length == 0 ? (<p>In diesem Kurs sind keine Schüler...</p>) : studentData.map(object => {
                                        const rating = object.rating
                                        const student = object.student
                                        return(
                                            <div key={student.id} className="flex flex-row justify-between items-center w-full text-stone-800 text-lg border-b border-zinc-500 border-dashed last:border-0 py-2 cursor-pointer hover:bg-slate-50">
                                                <div className="w-80 flex flex-row items-center justify-between">
                                                    <p className="w-full">{student.sirname}, {student.name}</p>
                                                    {student.gender == 0 ? (<BsGenderMale />) : (<BsGenderFemale />)}
                                                </div>
                                                <p>
                                                    {rating}
                                                </p>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context.params?.id

    const course = await prisma.course.findFirst({
        where: {
            id: id?.toString()
        }
    })

    const students = await prisma.student.findMany({
        where: {
            course_participation: {
                some: {
                    course: {
                        id: id?.toString()
                    }
                }
            }
        }
    })

    const answers = await prisma.answer.findMany({
        where: {
            session: {
                course: {
                    id: id?.toString()
                }
            }
        }
    })

    const annotations = await prisma.annotation.findMany({
        where: {
            session: {
                course: {
                    id: id?.toString()
                }
            }
        }
    })

    return {
        props: {course, students, answers, annotations}
    }
}

export default Course