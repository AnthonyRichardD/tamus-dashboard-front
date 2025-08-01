import moment from 'moment';
import { ExamAppointment } from '../types/exam';

export const mockExamAppointments: ExamAppointment[] = [
    {
        id: 1,
        patient_id: 1,
        exam_slot_id: 1,
        requesting_doctor_id: 1,
        status: "completed",
        created_at: moment().subtract(2, "hours").toISOString(),
        exam: {
            id: 1,
            exam_type: "Hemograma Completo",
            duration_minutes: 15,
            available_locations: ["Laboratório Central", "Unidade Norte"],
        },
        requesting_doctor: {
            id: 1,
            name: "Dr. João Cardiologista",
            specialty: "Cardiologia",
            registration_number: "CRM123456",
            active: true,
            color_code: "#3498db",
        },
        start_time: moment().subtract(2, "hours").toISOString(),
        end_time: moment().subtract(2, "hours").add(15, "minutes").toISOString(),
        location: "Laboratório Central",
    },
    {
        id: 2,
        patient_id: 2,
        exam_slot_id: 2,
        requesting_doctor_id: 2,
        status: "scheduled",
        created_at: moment().add(1, "hour").toISOString(),
        exam: {
            id: 2,
            exam_type: "Ultrassom Abdominal",
            duration_minutes: 30,
            available_locations: ["Unidade Central", "Unidade Sul"],
        },
        requesting_doctor: {
            id: 2,
            name: "Dra. Ana Endocrinologista",
            specialty: "Endocrinologia",
            registration_number: "CRM789012",
            active: true,
            color_code: "#e74c3c",
        },
        start_time: moment().add(1, "hour").toISOString(),
        end_time: moment().add(1, "hour").add(30, "minutes").toISOString(),
        location: "Unidade Central",
    },
    {
        id: 3,
        patient_id: 3,
        exam_slot_id: 3,
        requesting_doctor_id: 3,
        status: "scheduled",
        created_at: moment().add(3, "hours").toISOString(),
        exam: {
            id: 3,
            exam_type: "Raio-X Tórax",
            duration_minutes: 20,
            available_locations: ["Unidade Central", "Unidade Norte"],
        },
        requesting_doctor: {
            id: 3,
            name: "Dr. Carlos Pediatra",
            specialty: "Pediatria",
            registration_number: "CRM456789",
            active: true,
            color_code: "#2ecc71",
        },
        start_time: moment().add(3, "hours").toISOString(),
        end_time: moment().add(3, "hours").add(20, "minutes").toISOString(),
        location: "Unidade Norte",
    },
    {
        id: 4,
        patient_id: 4,
        exam_slot_id: 4,
        requesting_doctor_id: 1,
        status: "canceled",
        created_at: moment().subtract(1, "day").toISOString(),
        exam: {
            id: 4,
            exam_type: "Eletrocardiograma",
            duration_minutes: 25,
            available_locations: ["Unidade Central"],
        },
        requesting_doctor: {
            id: 1,
            name: "Dr. João Cardiologista",
            specialty: "Cardiologia",
            registration_number: "CRM123456",
            active: true,
            color_code: "#3498db",
        },
        start_time: moment().subtract(1, "day").toISOString(),
        end_time: moment().subtract(1, "day").add(25, "minutes").toISOString(),
        location: "Unidade Central",
    },
];

// Funções utilitárias para filtrar exames (usarão o moment)
export const filterExamsByPeriod = (exams: ExamAppointment[], period: 'today' | 'this_week' | 'all') => {
    const now = moment();
    return exams.filter(exam => {
        const examTime = moment(exam.start_time);
        if (period === 'today') {
            return examTime.isSame(now, 'day');
        }
        if (period === 'this_week') {
            return examTime.isSame(now, 'week');
        }
        return true; // 'all'
    });
};

export const getExamSummary = (exams: ExamAppointment[]) => {
    return {
        total: exams.length,
        completed: exams.filter(e => e.status === 'completed').length,
        scheduled: exams.filter(e => e.status === 'scheduled').length,
        canceled: exams.filter(e => e.status === 'canceled').length,
    };
};