export const mockUsers = [
    {
        _id: "65f1a2b3c4d5e6f7a8b9c201",
        name: "Andi Wijaya",
        nis: "20250001",
        role: "student",
        class_id: { _id: "65f1a2b3c4d5e6f7a8b9c001", class_name: "10 IPA 1", grade_level: "10" }
    },
    {
        _id: "65f1a2b3c4d5e6f7a8b9c101",
        name: "Pak Ahmad Hidayat",
        email: "ahmad.hidayat@sekolah.id",
        role: "teacher"
    },
    {
        _id: "65f1a2b3c4d5e6f7a8b9c999",
        name: "Admin Sekolah",
        email: "admin@sekolah.id",
        role: "admin"
    }
];

export const mockClasses = [
    {
        _id: "65f1a2b3c4d5e6f7a8b9c001",
        class_name: "10 IPA 1",
        grade_level: "10",
        school_year: "2025/2026",
        teacher_id: { _id: "65f1a2b3c4d5e6f7a8b9c101", name: "Pak Ahmad Hidayat" },
        student_count: 2
    }
];

export const mockActivities = [
    {
        _id: "65f1a2b3c4d5e6f7a8b9c301",
        student_id: { _id: "65f1a2b3c4d5e6f7a8b9c201", name: "Andi Wijaya", class_id: { class_name: "10 IPA 1" } },
        activity_type: "pushup",
        count: 50,
        image_url: "https://placehold.co/600x400?text=Pushup+Proof",
        report_date: "2026-01-10T00:00:00.000Z",
        status: "verified",
        verified_by: { _id: "65f1a2b3c4d5e6f7a8b9c101", name: "Pak Ahmad Hidayat" },
        verified_at: "2026-01-10T09:30:00.000Z",
        notes: "Bagus, terus pertahankan!",
        created_at: "2026-01-10T07:15:00.000Z"
    },
    {
        _id: "65f1a2b3c4d5e6f7a8b9c302",
        student_id: { _id: "65f1a2b3c4d5e6f7a8b9c201", name: "Andi Wijaya", class_id: { class_name: "10 IPA 1" } },
        activity_type: "situp",
        count: 40,
        image_url: "https://placehold.co/600x400?text=Situp+Proof",
        status: "pending",
        created_at: "2026-01-10T07:20:00.000Z"
    }
];

export const mockAnnouncements = [
    {
        _id: "65f1a2b3c4d5e6f7a8b9c401",
        title: "Jadwal Pengumpulan Laporan",
        content: "Mohon untuk rutin mengumpulkan laporan aktivitas setiap hari sebelum pukul 20:00 WIB.",
        author_id: { name: "Pak Ahmad Hidayat" },
        target_type: "class",
        target_class_id: { class_name: "10 IPA 1" },
        created_at: "2026-01-08T08:00:00.000Z",
        is_read: true
    }
];

export const mockStats = {
    user: {
        _id: "65f1a2b3c4d5e6f7a8b9c201",
        name: "Andi Wijaya",
        className: "10 IPA 1"
    },
    weeklyStats: {
        totalActivities: 8,
        totalPushup: 100,
        totalSitup: 80,
        totalBackup: 60,
        verifiedCount: 6,
        pendingCount: 2
    }
};
