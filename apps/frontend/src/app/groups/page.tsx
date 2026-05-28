'use client';

import React, { useState } from 'react';
import { Users, GraduationCap, Plus, ChevronRight, TrendingUp, BookOpen, Search, Filter } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';

interface ClassGroup {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  activeAssignments: number;
  averageScore: number;
  grade: string;
  gradient: string;
  students: { name: string; roll: string; lastScore: string }[];
}

const INITIAL_GROUPS: ClassGroup[] = [
  {
    id: 'g1',
    name: 'Grade 10-A (Science)',
    subject: 'Biology & Chemistry',
    studentCount: 38,
    activeAssignments: 3,
    averageScore: 84,
    grade: 'Grade 10',
    gradient: 'from-emerald-500 to-teal-600',
    students: [
      { name: 'Aarav Sharma', roll: '10A-01', lastScore: '92%' },
      { name: 'Ananya Iyer', roll: '10A-02', lastScore: '88%' },
      { name: 'Kabir Verma', roll: '10A-14', lastScore: '76%' },
      { name: 'Meera Nair', roll: '10A-20', lastScore: '95%' },
      { name: 'Rohan Gupta', roll: '10A-27', lastScore: '81%' },
    ],
  },
  {
    id: 'g2',
    name: 'Grade 8-B (Mathematics)',
    subject: 'Algebra & Geometry',
    studentCount: 32,
    activeAssignments: 2,
    averageScore: 78,
    grade: 'Grade 8',
    gradient: 'from-indigo-500 to-blue-600',
    students: [
      { name: 'Aditya Rao', roll: '08B-03', lastScore: '84%' },
      { name: 'Ishita Patel', roll: '08B-09', lastScore: '71%' },
      { name: 'Nehal Joshi', roll: '08B-15', lastScore: '90%' },
      { name: 'Siddharth Sen', roll: '08B-22', lastScore: '65%' },
      { name: 'Zara Khan', roll: '08B-31', lastScore: '82%' },
    ],
  },
  {
    id: 'g3',
    name: 'Grade 11-A (Physics)',
    subject: 'Electromagnetism',
    studentCount: 29,
    activeAssignments: 4,
    averageScore: 81,
    grade: 'Grade 11',
    gradient: 'from-orange-500 to-amber-600',
    students: [
      { name: 'Dev Bajwa', roll: '11A-04', lastScore: '79%' },
      { name: 'Gauri Misra', roll: '11A-08', lastScore: '93%' },
      { name: 'Manish Pandey', roll: '11A-12', lastScore: '85%' },
      { name: 'Pooja Sethi', roll: '11A-18', lastScore: '74%' },
      { name: 'Yash Vardhan', roll: '11A-25', lastScore: '88%' },
    ],
  },
  {
    id: 'g4',
    name: 'Grade 9-C (English)',
    subject: 'Literature & Grammar',
    studentCount: 35,
    activeAssignments: 1,
    averageScore: 89,
    grade: 'Grade 9',
    gradient: 'from-purple-500 to-pink-600',
    students: [
      { name: 'Aryan Goel', roll: '09C-02', lastScore: '91%' },
      { name: 'Diya Kapoor', roll: '09C-07', lastScore: '94%' },
      { name: 'Kunal Kapoor', roll: '09C-16', lastScore: '83%' },
      { name: 'Riya Malhotra', roll: '09C-21', lastScore: '87%' },
      { name: 'Tanvi Shah', roll: '09C-28', lastScore: '90%' },
    ],
  },
];

export default function MyGroupsPage() {
  const [groups, setGroups] = useState<ClassGroup[]>(INITIAL_GROUPS);
  const [selectedGroup, setSelectedGroup] = useState<ClassGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const { showToast } = useUiStore();

  // Form states for adding class
  const [newClassName, setNewClassName] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newGrade, setNewGrade] = useState('');
  const [newStudentCount, setNewStudentCount] = useState(30);

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName || !newSubject || !newGrade) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    const randomGradients = [
      'from-emerald-500 to-teal-600',
      'from-indigo-500 to-blue-600',
      'from-orange-500 to-amber-600',
      'from-purple-500 to-pink-600',
    ];
    const gradient = randomGradients[Math.floor(Math.random() * randomGradients.length)];

    const newGroup: ClassGroup = {
      id: `g${groups.length + 1}`,
      name: `${newGrade} (${newClassName})`,
      subject: newSubject,
      studentCount: Number(newStudentCount),
      activeAssignments: 0,
      averageScore: 0,
      grade: newGrade,
      gradient,
      students: [
        { name: 'John Doe', roll: '01', lastScore: 'N/A' },
        { name: 'Jane Smith', roll: '02', lastScore: 'N/A' },
      ],
    };

    setGroups([...groups, newGroup]);
    setNewClassName('');
    setNewSubject('');
    setNewGrade('');
    setNewStudentCount(30);
    setShowAddModal(false);
    showToast('Class group created successfully!', 'success');
  };

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 relative">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="w-2 h-2 rounded-full bg-emerald-500 absolute" />
        <h1 className="text-lg font-bold text-neutral-900 leading-none pl-2.5">My Groups</h1>
      </div>
      <p className="text-xs text-neutral-500 -mt-4 pl-4.5 font-medium">
        Manage student cohorts, classes, view lists, and track collective scoring analytics.
      </p>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 border border-neutral-200 rounded-full px-4 py-2 bg-white w-full sm:w-64 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-100 transition-all">
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search group or subject"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs outline-none flex-1 text-neutral-800 placeholder-neutral-400 bg-transparent"
            />
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-md active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Class Group
        </button>
      </div>

      {/* Grid of Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            onClick={() => setSelectedGroup(group)}
            className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer overflow-hidden flex flex-col justify-between group"
          >
            {/* Gradient Top */}
            <div className={`bg-gradient-to-r ${group.gradient} p-5 text-white flex justify-between items-start`}>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded">
                  {group.grade}
                </span>
                <h3 className="font-bold text-lg mt-2 group-hover:underline">{group.name}</h3>
                <p className="text-xs text-white/80 font-medium flex items-center gap-1 mt-1">
                  <BookOpen className="w-3 h-3" /> {group.subject}
                </p>
              </div>
              <div className="p-2 bg-white/10 rounded-full">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* Metrics */}
            <div className="p-5 grid grid-cols-3 gap-4 border-b border-neutral-50 bg-neutral-50/50">
              <div className="text-center border-r border-neutral-100 last:border-0">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Students</p>
                <p className="text-lg font-bold text-neutral-800 mt-0.5">{group.studentCount}</p>
              </div>
              <div className="text-center border-r border-neutral-100 last:border-0">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Active Exams</p>
                <p className="text-lg font-bold text-neutral-800 mt-0.5">{group.activeAssignments}</p>
              </div>
              <div className="text-center last:border-0">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Avg Score</p>
                <p className="text-lg font-bold text-emerald-600 mt-0.5 flex items-center justify-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> {group.averageScore > 0 ? `${group.averageScore}%` : 'N/A'}
                </p>
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="px-5 py-3.5 flex justify-between items-center text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors">
              <span>View Roster & Detail Analytics</span>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Class Details Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className={`bg-gradient-to-r ${selectedGroup.gradient} p-6 text-white flex justify-between items-center`}>
              <div>
                <h3 className="font-bold text-xl">{selectedGroup.name}</h3>
                <p className="text-xs text-white/80">{selectedGroup.subject}</p>
              </div>
              <button
                onClick={() => setSelectedGroup(null)}
                className="text-white hover:text-neutral-200 font-bold text-xl leading-none p-1.5 hover:bg-white/10 rounded-full"
              >
                &times;
              </button>
            </div>

            {/* Roster & Stats */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider pb-1 border-b border-neutral-100">
                <span>Student Roster ({selectedGroup.studentCount} total)</span>
                <span>Last Exam Score</span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedGroup.students.map((student, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 px-3 hover:bg-neutral-50 rounded-xl transition-all border border-transparent hover:border-neutral-100">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-neutral-100 font-bold text-neutral-700 text-xs flex items-center justify-center">
                        {student.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-800">{student.name}</p>
                        <p className="text-[10px] text-neutral-400 font-medium">{student.roll}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold ${student.lastScore === 'N/A' ? 'text-neutral-400' : 'text-emerald-600'}`}>
                      {student.lastScore}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-semibold rounded-full hover:bg-neutral-50 transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedGroup(null);
                    showToast('Direct assignment workflow ready!', 'success');
                  }}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-full shadow transition-all"
                >
                  Create Assessment for Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddClass}
            className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150"
          >
            <div className="px-6 py-4 bg-neutral-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-base flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" /> Add New Class Group
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white font-bold text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Class Grade</label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full h-11 px-4 border border-neutral-200 rounded-xl text-xs outline-none bg-white font-medium text-neutral-800 focus:border-neutral-400"
                  required
                >
                  <option value="">Select Grade</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Section Name</label>
                <input
                  type="text"
                  placeholder="e.g. A (Science), B (Mathematics)"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full h-11 px-4 border border-neutral-200 rounded-xl text-xs outline-none bg-white font-medium text-neutral-800 focus:border-neutral-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Subject & Field</label>
                <input
                  type="text"
                  placeholder="e.g. Inorganic Chemistry, Mechanics"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full h-11 px-4 border border-neutral-200 rounded-xl text-xs outline-none bg-white font-medium text-neutral-800 focus:border-neutral-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Number of Students</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={newStudentCount}
                  onChange={(e) => setNewStudentCount(Number(e.target.value))}
                  className="w-full h-11 px-4 border border-neutral-200 rounded-xl text-xs outline-none bg-white font-medium text-neutral-800 focus:border-neutral-400"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-semibold rounded-full hover:bg-neutral-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-full shadow hover:shadow-md active:scale-95 transition-all"
                >
                  Create Group
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
