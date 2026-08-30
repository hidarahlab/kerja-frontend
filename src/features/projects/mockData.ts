import type { Project } from './types'

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    code: 'PRJ-01',
    name: 'Target Penjualan Q3 2026',
    description: 'Dorong pipeline dan kanal reseller sampai akhir kuartal.',
    category: 'PENJUALAN',
    progress: 0,
    assignees: [
      { initials: 'DA', name: 'Diana Aprianto' },
      { initials: 'SL', name: 'Sylvia Lestari' },
    ],
    deadline: new Date('2026-09-30'),
  },
  {
    id: '2',
    code: 'PRJ-02',
    name: 'Laporan & Data Penjualan',
    description: 'Sumber angka untuk dashboard dan laporan direktesi.',
    category: 'LAPORAN',
    progress: 0,
    assignees: [
      { initials: 'BS', name: 'Bambang Sutrisno' },
      { initials: 'DA', name: 'Diana Aprianto' },
    ],
    deadline: new Date('2026-09-01'),
  },
  {
    id: '3',
    code: 'PRJ-03',
    name: 'Operasional & SOP Gudang',
    description: 'Perbaikan alur retur, logistik, dan data pelangggan.',
    category: 'OPERASIONAL',
    progress: 33,
    assignees: [
      { initials: 'RP', name: 'Rudi Prasetyo' },
      { initials: 'BS', name: 'Bambang Sutrisno' },
    ],
    deadline: new Date('2026-10-15'),
  },
  {
    id: '4',
    code: 'PRJ-04',
    name: 'Administrasi & Tim',
    description: 'Keuangan internal, onboarding, dan pelatihan staf.',
    category: 'HR',
    progress: 50,
    assignees: [
      { initials: 'NR', name: 'Nanda Rahmasari' },
      { initials: 'DA', name: 'Diana Aprianto' },
    ],
    deadline: new Date('2026-09-08'),
  },
]
