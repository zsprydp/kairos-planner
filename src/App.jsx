import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  signInWithCustomToken,
  GoogleAuthProvider,
  linkWithPopup,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  onSnapshot, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { 
  BookOpen, 
  CheckCircle, 
  Circle, 
  Coffee, 
  Calendar as CalendarIcon, 
  Users, 
  Sparkles, 
  Plus, 
  MoreVertical, 
  Layout, 
  Menu,
  X,
  ChevronRight,
  Brain,
  Umbrella,
  Flower,
  Leaf,
  Feather,
  Clock,
  ChevronLeft,
  Settings,
  Edit,
  Trash2,
  List,
  Sun,
  Palette,
  ChevronsLeft,
  ChevronsRight,
  User,
  Zap,
  Tag,
  Book,
  Grid,
  Upload,
  ExternalLink,
  Printer,
  LogOut
} from 'lucide-react';
import LandingPage from './components/LandingPage';

// --- Configuration ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sanitized App ID for Firestore paths
const rawAppId = import.meta.env.VITE_APP_ID || 'default-kairos';
const appId = rawAppId.replace(/[^a-zA-Z0-9_-]/g, '_');

const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY || "";

const COLOR_OPTIONS = [
  { name: 'Sage', class: 'bg-green-100 text-green-700', value: 'green' },
  { name: 'Ochre', class: 'bg-yellow-100 text-yellow-700', value: 'yellow' },
  { name: 'Rose', class: 'bg-pink-100 text-pink-700', value: 'pink' },
  { name: 'Cobalt', class: 'bg-blue-100 text-blue-700', value: 'blue' },
  { name: 'Clay', class: 'bg-orange-100 text-orange-700', value: 'orange' },
];

const ICON_OPTIONS = {
  Coffee: Coffee,
  Leaf: Leaf,
  Sun: Sun,
  BookOpen: BookOpen,
  Users: Users,
  Sparkles: Sparkles,
  Zap: Zap,
  Brain: Brain,
};

// --- Firestore Helpers ---
const getUserCollectionRef = (collectionName, userId) => 
  collection(db, 'artifacts', appId, 'users', userId, collectionName);

// --- General UI Components ---

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-dvh bg-[#FDFBF7] text-stone-600">
    <div className="animate-pulse flex flex-col items-center">
      <Flower size={48} className="mb-4 text-[#5F6F52]" />
      <h2 className="text-2xl font-serif tracking-widest text-[#2F3E32]">KAIRÓS</h2>
      <p className="text-sm mt-2 font-serif italic text-stone-500">"Education is an atmosphere, a discipline, a life."</p>
    </div>
  </div>
);

const ModalWrapper = ({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[#2F3E32]/20 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className={`bg-[#FDFBF7] rounded-t-2xl sm:rounded-2xl shadow-xl w-full ${maxWidth} p-6 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:fade-in-20 border border-[#E8E4D9]`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-serif text-[#2F3E32] flex items-center gap-2">
            {title}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-[#E8E4D9] rounded-full">
            <X size={20} className="text-stone-400" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// --- Reports Modal ---
const ReportsModal = ({ isOpen, onClose, students, assignments, activeStudentId }) => {
  const [selectedStudentId, setSelectedStudentId] = useState(activeStudentId);
  const printRef = useRef();

  useEffect(() => {
    if (isOpen && activeStudentId) {
      setSelectedStudentId(activeStudentId);
    }
  }, [isOpen, activeStudentId]);

  const completedTasks = useMemo(() => {
    return assignments
      .filter(t => t.studentId === selectedStudentId && t.status === 'completed')
      .sort((a, b) => {
        const dateA = a.completedAt?.seconds || 0;
        const dateB = b.completedAt?.seconds || 0;
        return dateB - dateA; // Descending
      });
  }, [assignments, selectedStudentId]);

  const handlePrint = () => {
    const content = printRef.current;
    const printWindow = window.open('', '', 'height=600,width=800');
    
    printWindow.document.write('<html><head><title>Portfolio Report</title>');
    printWindow.document.write(`
      <style>
        body { font-family: 'Crimson Text', serif; padding: 40px; color: #2F3E32; }
        h1 { font-size: 24px; margin-bottom: 10px; border-bottom: 2px solid #E8E4D9; padding-bottom: 10px; }
        h2 { font-size: 18px; margin-top: 20px; color: #5F6F52; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { text-align: left; padding: 8px; border-bottom: 1px solid #E8E4D9; }
        th { font-weight: bold; color: #5F6F52; }
        .meta { color: #666; font-size: 14px; margin-bottom: 30px; }
      </style>
    `);
    printWindow.document.write('</head><body>');
    printWindow.document.write(content.innerHTML);
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (!isOpen) return null;

  const student = students.find(s => s.id === selectedStudentId);

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Student Portfolio" maxWidth="max-w-4xl">
      <div className="flex flex-col h-[70vh]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <select 
              value={selectedStudentId} 
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="p-2 border border-[#E8E4D9] rounded-lg font-serif text-[#2F3E32]"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.display_name}</option>
              ))}
            </select>
            <span className="text-stone-500 text-sm">{completedTasks.length} completed tasks</span>
          </div>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-[#2F3E32] text-[#F9F7F2] rounded-lg hover:bg-[#1A231C] transition-colors"
          >
            <Printer size={16} />
            Print Report
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white border border-[#E8E4D9] rounded-xl p-8 shadow-sm" >
          <div ref={printRef}>
            <h1 className="text-3xl font-serif font-bold text-[#2F3E32] mb-2">
              {student?.display_name}'s Portfolio
            </h1>
            <p className="text-stone-500 italic mb-8">
              Generated on {new Date().toLocaleDateString()}
            </p>

            {completedTasks.length === 0 ? (
              <p className="text-stone-500 text-center py-10">No completed tasks found for this student.</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-[#E8E4D9]">
                    <th className="py-2 font-serif text-[#5F6F52]">Date Completed</th>
                    <th className="py-2 font-serif text-[#5F6F52]">Subject</th>
                    <th className="py-2 font-serif text-[#2F3E32]">Activity / Book</th>
                  </tr>
                </thead>
                <tbody>
                  {completedTasks.map(task => {
                    let dateStr = "—";
                    if (task.completedAt) {
                      // Handle Firestore Timestamp
                      const date = task.completedAt.toDate ? task.completedAt.toDate() : new Date(task.completedAt);
                      dateStr = date.toLocaleDateString();
                    }
                    return (
                      <tr key={task.id} className="border-b border-[#E8E4D9]/50">
                        <td className="py-3 text-stone-500 text-sm font-mono">{dateStr}</td>
                        <td className="py-3 font-bold text-[#A9B388] text-xs uppercase tracking-widest">{task.subject}</td>
                        <td className="py-3 font-serif text-[#2F3E32]">{task.title}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

// --- CSV Import Modal ---
const ImportCSVModal = ({ isOpen, onClose, userId, students, onBulkAdd }) => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setParsedData(null);
      setErrors([]);
    }
  }, [isOpen]);

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return [];
    
    // Simple splitting, assuming comma delimiter and no quoted fields
    const header = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const record = {};
      header.forEach((h, i) => {
        record[h] = values[i];
      });
      return record;
    });
    return { header, data };
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setParsedData(null);
      setErrors([]);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const { header, data } = parseCSV(event.target.result);
          
          const requiredFields = ['title', 'subject', 'duration', 'studentName'];
          const missingFields = requiredFields.filter(f => !header.includes(f));
          
          if (missingFields.length > 0) {
            setErrors([`Missing required CSV columns: ${missingFields.join(', ')}. Please use lowercase column names.`]);
            setParsedData(null);
            return;
          }

          const studentMap = students.reduce((acc, s) => {
            acc[s.display_name.toLowerCase()] = s.id;
            return acc;
          }, {});

          const records = data.map((d, index) => {
            const name = d.studentName ? d.studentName.toLowerCase() : '';
            const studentId = studentMap[name];
            
            return {
              title: d.title || `Task ${index + 1}`,
              subject: d.subject || 'Uncategorized',
              duration: d.duration || '20',
              studentName: d.studentName,
              studentId: studentId,
              dueDate: d.dueDate || null, // Optional YYYY-MM-DD
              line: index + 2, // CSV line number
              isValid: !!studentId && !!d.title,
            };
          });

          setParsedData(records);
          setErrors(records.filter(r => !r.isValid).map(r => 
            `Line ${r.line}: Cannot find student '${r.studentName}'. Record skipped.`
          ));
        } catch (err) {
          setErrors(['Failed to read or parse CSV file.']);
          setParsedData(null);
        }
      };
      reader.readAsText(selectedFile);
    } else {
      setErrors(['Please select a valid CSV file.']);
      setFile(null);
    }
  };

  const handleImport = async () => {
    if (!parsedData || isProcessing) return;

    const validRecords = parsedData.filter(d => d.isValid);
    if (validRecords.length === 0) {
      setErrors(prev => [...prev, 'No valid records to import.']);
      return;
    }

    setIsProcessing(true);
    try {
      await onBulkAdd(validRecords);
      onClose();
    } catch (e) {
      console.error("Bulk add error:", e);
      setErrors(prev => [...prev, 'An error occurred during bulk data upload to the database.']);
    } finally {
      setIsProcessing(false);
    }
  };

  const validRecordCount = parsedData ? parsedData.filter(d => d.isValid).length : 0;

  return (
    <ModalWrapper 
      isOpen={isOpen} 
      onClose={onClose} 
      title={<span className="flex items-center gap-2"><Upload size={20}/> Import Tasks (CSV)</span>} 
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        <p className="text-sm text-stone-600 font-serif">
          Import tasks from a CSV file. The file must contain the following columns (case sensitive, lowercase): 
          <code className="bg-[#E8E4D9] p-1 rounded text-xs font-mono mx-1">title</code>, 
          <code className="bg-[#E8E4D9] p-1 rounded text-xs font-mono mx-1">subject</code>, 
          <code className="bg-[#E8E4D9] p-1 rounded text-xs font-mono mx-1">duration</code>, and 
          <code className="bg-[#E8E4D9] p-1 rounded text-xs font-mono mx-1">studentName</code> (must exactly match a child's name).
          <code className="bg-[#E8E4D9] p-1 rounded text-xs font-mono mx-1">dueDate</code> (optional, YYYY-MM-DD).
        </p>

        <div 
          className="border-2 border-dashed border-[#A9B388]/50 rounded-xl p-8 text-center cursor-pointer hover:bg-[#F6F4EE] transition-colors"
          onClick={() => fileInputRef.current.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <Upload size={24} className="mx-auto mb-2 text-[#A9B388]" />
          <p className="font-serif font-medium text-[#2F3E32]">
            {file ? file.name : 'Click to select a CSV file'}
          </p>
          {file && <p className="text-xs text-stone-500 mt-1">{file.size} bytes</p>}
        </div>

        {parsedData && (
          <div className="bg-white p-4 rounded-xl border border-[#E8E4D9]">
            <p className="text-sm font-bold text-[#2F3E32]">
              Found <span className="text-[#5F6F52]">{validRecordCount}</span> valid tasks for import.
            </p>
            {errors.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg max-h-40 overflow-y-auto">
                <p className="text-xs font-bold text-red-700 mb-1">Errors ({errors.length}):</p>
                <ul className="list-disc list-inside space-y-0.5 text-xs text-red-600">
                  {errors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        <button 
          onClick={handleImport}
          disabled={!parsedData || validRecordCount === 0 || isProcessing}
          className="w-full py-3 bg-[#CB8F46] text-[#2F3E32] font-bold rounded-xl hover:bg-[#A97538] transition-all font-serif disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Clock size={16} className="animate-spin" /> Importing...
            </>
          ) : (
            <>
              <ExternalLink size={16} /> Bulk Import {validRecordCount > 0 && `(${validRecordCount})`}
            </>
          )}
        </button>
      </div>
    </ModalWrapper>
  );
};

// --- AI Service ---
const generatePortfolioSummary = async (studentName, completedTasks) => {
  if (!completedTasks.length) return "No tasks completed yet.";
  
  const prompt = `
    Act as a warm and observant homeschool educator.
    Write a 2-sentence narrative progress summary for a student named ${studentName}.
    They have completed the following books and tasks: ${completedTasks.map(t => t.title).join(', ')}.
    Focus on: curiosity, habit formation, and engagement with learning.
    Tone: Gentle, encouraging, and thoughtful.
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate summary.";
  } catch (e) {
    console.error("AI Error", e);
    return "AI service temporarily unavailable.";
  }
};

// --- Rhythms Management Modal ---
const RhythmsModal = ({ isOpen, onClose, userId, rhythms, setRhythms }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Coffee');
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);
  const [editingRhythm, setEditingRhythm] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setEditingRhythm(null);
    setName('');
    setIcon('Coffee');
    setColor(COLOR_OPTIONS[0].value);
  };

  const handleEditClick = (rhythm) => {
    setEditingRhythm(rhythm);
    setName(rhythm.name);
    setIcon(rhythm.icon);
    setColor(rhythm.color);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    const rhythmData = { name, icon, color };
    const rhythmsRef = getUserCollectionRef('rhythms', userId);
    
    if (editingRhythm) {
      await updateDoc(doc(rhythmsRef, editingRhythm.id), rhythmData);
    } else {
      await addDoc(rhythmsRef, rhythmData);
    }
    resetForm();
  };

  const handleDelete = async (rhythmId) => {
    if (window.confirm('Are you sure you want to delete this Rhythm?')) {
      await deleteDoc(doc(getUserCollectionRef('rhythms', userId), rhythmId));
    }
  };

  const IconComponent = ICON_OPTIONS[icon];

  return (
    <ModalWrapper 
      isOpen={isOpen} 
      onClose={onClose} 
      title={<span className="flex items-center gap-2"><List size={20}/> Manage Rhythms</span>}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-4 border border-[#E8E4D9] rounded-xl bg-[#F6F4EE]/50">
        <h4 className="text-lg font-serif text-[#2F3E32]">{editingRhythm ? 'Edit Rhythm' : 'New Rhythm'}</h4>
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1 font-serif">Rhythm Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Morning Basket, Nature Walks, Handicrafts"
            className="w-full p-3 bg-white border border-[#E8E4D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A9B388]/50 font-serif"
            autoFocus
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1 font-serif">Icon</label>
            <select 
              value={icon} 
              onChange={(e) => setIcon(e.target.value)}
              className="w-full p-3 bg-white border border-[#E8E4D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A9B388]/50 font-serif text-sm"
            >
              {Object.keys(ICON_OPTIONS).map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1 font-serif">Color</label>
            <select 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              className="w-full p-3 bg-white border border-[#E8E4D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A9B388]/50 font-serif text-sm"
            >
              {COLOR_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-2">
          {editingRhythm && (
            <button 
              type="button"
              onClick={resetForm}
              className="flex-1 py-3 px-4 rounded-xl text-stone-600 font-medium hover:bg-stone-100 transition-colors font-serif"
            >
              Cancel Edit
            </button>
          )}
          <button 
            type="submit"
            className={`flex-1 py-3 px-4 rounded-xl text-[#F9F7F2] font-bold shadow-lg transition-all font-serif ${editingRhythm ? 'bg-[#CB8F46] hover:bg-[#A97538] shadow-[#CB8F46]/30' : 'bg-[#2F3E32] hover:bg-[#1A231C] shadow-[#2F3E32]/30'}`}
          >
            {editingRhythm ? 'Update Rhythm' : 'Add Rhythm'}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h4 className="text-lg font-serif text-[#2F3E32]">Current Rhythms</h4>
        {rhythms.map(rhythm => {
          const ItemIcon = ICON_OPTIONS[rhythm.icon] || Sparkles;
          const colorClass = COLOR_OPTIONS.find(c => c.value === rhythm.color)?.class || COLOR_OPTIONS[0].class;
          
          return (
            <div key={rhythm.id} className="flex items-center justify-between p-3 bg-white border border-[#E8E4D9] rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                  <ItemIcon size={16} />
                </div>
                <span className="font-serif text-lg text-[#2F3E32]">{rhythm.name}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditClick(rhythm)}
                  className="p-2 text-stone-500 hover:text-[#CB8F46] hover:bg-stone-50 rounded-full transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(rhythm.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ModalWrapper>
  );
};

// --- Student Management Modal ---
const StudentModal = ({ isOpen, onClose, userId, students, setActiveStudentId }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setEditingStudent(null);
    setName('');
    setAge('');
    setColor(COLOR_OPTIONS[0].value);
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setName(student.display_name);
    setAge(student.age);
    setColor(student.color);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    const studentData = { display_name: name, age: parseInt(age) || null, color };
    const studentsRef = getUserCollectionRef('profiles', userId);
    
    if (editingStudent) {
      await updateDoc(doc(studentsRef, editingStudent.id), studentData);
    } else {
      const newDoc = await addDoc(studentsRef, studentData);
      setActiveStudentId(newDoc.id); // Set the new student as active
    }
    resetForm();
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('WARNING: Deleting a student will also delete all of their assignments and history. Are you sure?')) {
      // 1. Delete student assignments (not implemented fully here but should be in a real app)
      // 2. Delete student profile
      await deleteDoc(doc(getUserCollectionRef('profiles', userId), studentId));
      setActiveStudentId(null); // Clear active student
    }
  };

  return (
    <ModalWrapper 
      isOpen={isOpen} 
      onClose={onClose} 
      title={<span className="flex items-center gap-2"><User size={20}/> Manage Children</span>}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-4 border border-[#E8E4D9] rounded-xl bg-[#F6F4EE]/50">
        <h4 className="text-lg font-serif text-[#2F3E32]">{editingStudent ? 'Edit Profile' : 'Add New Child'}</h4>
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1 font-serif">Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Child's Name"
            className="w-full p-3 bg-white border border-[#E8E4D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A9B388]/50 font-serif"
            autoFocus
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1 font-serif">Age</label>
            <input 
              type="number" 
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 8"
              min="1"
              max="18"
              className="w-full p-3 bg-white border border-[#E8E4D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A9B388]/50 font-serif text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1 font-serif">Color</label>
            <select 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              className="w-full p-3 bg-white border border-[#E8E4D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A9B388]/50 font-serif text-sm"
            >
              {COLOR_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-2">
          {editingStudent && (
            <button 
              type="button"
              onClick={resetForm}
              className="flex-1 py-3 px-4 rounded-xl text-stone-600 font-medium hover:bg-stone-100 transition-colors font-serif"
            >
              Cancel Edit
            </button>
          )}
          <button 
            type="submit"
            className={`flex-1 py-3 px-4 rounded-xl text-[#F9F7F2] font-bold shadow-lg transition-all font-serif ${editingStudent ? 'bg-[#CB8F46] hover:bg-[#A97538] shadow-[#CB8F46]/30' : 'bg-[#2F3E32] hover:bg-[#1A231C] shadow-[#2F3E32]/30'}`}
          >
            {editingStudent ? 'Update Profile' : 'Add Child'}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h4 className="text-lg font-serif text-[#2F3E32]">Current Students</h4>
        {students.map(student => {
          const colorClass = COLOR_OPTIONS.find(c => c.value === student.color)?.class || COLOR_OPTIONS[0].class;
          return (
            <div key={student.id} className="flex items-center justify-between p-3 bg-white border border-[#E8E4D9] rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm ${colorClass}`}>
                  {student.display_name[0]}
                </div>
                <span className="font-serif text-lg text-[#2F3E32]">{student.display_name}</span>
                {student.age && <span className="text-sm text-stone-400">({student.age} yrs)</span>}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditClick(student)}
                  className="p-2 text-stone-500 hover:text-[#CB8F46] hover:bg-stone-50 rounded-full transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(student.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ModalWrapper>
  );
};

const SickDayModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[#2F3E32]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] rounded-2xl shadow-xl max-w-sm w-full p-6 border border-[#E8E4D9]">
        <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mb-4 mx-auto">
          <Umbrella className="text-red-800" size={24} />
        </div>
        <h3 className="text-xl font-serif text-center text-[#2F3E32] mb-2">Grace Period</h3>
        <p className="text-stone-600 text-center mb-6 text-sm font-serif">
          "The child is a person." It is okay to rest. This will gently move today's tasks back to the bank for another day.
        </p>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl text-stone-600 font-medium hover:bg-stone-100 transition-colors font-serif"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-[#A9B388] text-[#2F3E32] font-bold hover:bg-[#5F6F52] hover:text-white shadow-lg shadow-[#A9B388]/30 transition-all font-serif"
          >
            Reset Day
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskModal = ({ isOpen, onClose, studentId, onAdd, onEdit, taskToEdit }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Math');
  const [duration, setDuration] = useState('20');
  const [type, setType] = useState('Lesson');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setSubject(taskToEdit.subject);
        setDuration(taskToEdit.duration);
        setType(taskToEdit.type || 'Lesson');
        setDueDate(taskToEdit.dueDate || '');
      } else {
        setTitle('');
        setSubject('Math');
        setDuration('20');
        setType('Lesson');
        setDueDate('');
      }
    }
  }, [isOpen, taskToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const taskData = { 
      title, 
      subject, 
      type, 
      duration, 
      studentId, 
      dueDate: dueDate || null 
    };

    if (taskToEdit) {
      onEdit(taskToEdit.id, taskData);
    } else {
      onAdd(taskData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#2F3E32]/20 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-[#FDFBF7] rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md p-6 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:fade-in-20 border border-[#E8E4D9]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-serif text-[#2F3E32] flex items-center gap-2">
            <Feather size={18} />
            {taskToEdit ? 'Edit Entry' : 'New Entry'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-[#E8E4D9] rounded-full">
            <X size={20} className="text-stone-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1 font-serif">Activity Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Nature Walk, Copywork, Math Lesson..."
              className="w-full p-3 bg-white border border-[#E8E4D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A9B388]/50 focus:border-[#A9B388] transition-all font-serif"
              autoFocus
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1 font-serif">Subject</label>
              <select 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 bg-white border border-[#E8E4D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A9B388]/50 font-serif text-sm"
              >
                <optgroup label="Core Academics">
                  <option>Math</option>
                  <option>Reading</option>
                </optgroup>
                <optgroup label="Morning Basket">
                  <option>Copywork</option>
                  <option>Recitation</option>
                  <option>Poetry</option>
                  <option>Composer Study</option>
                  <option>Artist Study</option>
                  <option>Solfa/Hymn</option>
                  <option>History</option>
                </optgroup>
                <optgroup label="Nature & Hands">
                  <option>Nature Study</option>
                  <option>Handicrafts</option>
                </optgroup>
                <optgroup label="Habit & Service">
                  <option>Habit Training</option>
                  <option>Service</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1 font-serif">Duration</label>
              <div className="flex bg-[#E8E4D9] rounded-xl p-1 gap-1">
                {['10', '15', '20'].map(m => (
                  <button 
                    key={m}
                    type="button"
                    onClick={() => setDuration(m)}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all font-serif ${duration === m ? 'bg-white shadow-sm text-[#2F3E32]' : 'text-stone-500'}`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1 font-serif">Due Date (Optional)</label>
             <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-3 bg-white border border-[#E8E4D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A9B388]/50 focus:border-[#A9B388] transition-all font-serif"
             />
          </div>

          <button 
            type="submit"
            className="w-full py-4 mt-4 bg-[#2F3E32] text-[#F9F7F2] font-medium rounded-xl hover:bg-[#1A231C] active:scale-[0.98] transition-all font-serif shadow-lg shadow-[#2F3E32]/20"
          >
            {taskToEdit ? 'Update Entry' : 'Add to Bank'}
          </button>
        </form>
      </div>
    </div>
  );
};


// --- Calendar View Component (Updated) ---
const CalendarView = ({ tasks, activeStudentId, onEdit, onDelete }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  
  // FIXED: Initialize selectedDate using local YYYY-MM-DD to avoid UTC shifts
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const filteredTasksByDate = useMemo(() => {
    return tasks.filter(task => task.studentId === activeStudentId && task.dueDate === selectedDate);
  }, [tasks, activeStudentId, selectedDate]);

  const tasksByDay = useMemo(() => {
    const map = {};
    tasks
      .filter(t => t.studentId === activeStudentId && t.dueDate)
      .forEach(t => {
        const date = t.dueDate; // YYYY-MM-DD
        const [year, month, day] = date.split('-').map(Number);
        
        if (year === currentYear && month - 1 === currentMonth) {
          if (!map[day]) map[day] = 0;
          map[day] += 1;
        }
      });
    return map;
  }, [tasks, activeStudentId, currentYear, currentMonth]);

  const generateDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);

    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-[#F9F7F2]/50 border border-[#E8E4D9]/50"></div>);
    }

    // Days of the month
    for (let i = 1; i <= totalDays; i++) {
      // FIXED: Construct date string manually to guarantee it matches the visual 'i' day
      // This prevents timezone shifts (e.g. visual 14th becoming 15th in DB)
      const year = currentYear;
      const month = String(currentMonth + 1).padStart(2, '0');
      const day = String(i).padStart(2, '0');
      const dayDateString = `${year}-${month}-${day}`;

      // Calculate isToday using local date comparison
      const todayObj = new Date();
      const isToday = i === todayObj.getDate() && currentMonth === todayObj.getMonth() && currentYear === todayObj.getFullYear();
      
      const isSelected = dayDateString === selectedDate;
      const activityCount = tasksByDay[i] || 0;
      
      days.push(
        <div 
          key={`day-${i}`} 
          className={`h-24 p-2 border border-[#E8E4D9] relative group transition-all cursor-pointer 
            ${isSelected ? 'bg-[#A9B388]/20 border-2 border-[#A9B388] shadow-inner' : 'bg-white hover:bg-[#FDFBF7]'}`
          }
          onClick={() => {
            setSelectedDate(dayDateString);
            setIsDayModalOpen(true);
          }}
        >
          <span className={`text-sm font-serif ${isToday ? 'bg-[#CB8F46] text-white w-6 h-6 flex items-center justify-center rounded-full font-bold' : 'text-stone-500'}`}>
            {i}
          </span>
          
          {activityCount > 0 && (
             <div className="mt-2 space-y-1">
               <div className="flex gap-1 items-center">
                 <Book size={12} className="text-[#5F6F52]" />
                 <span className="text-xs font-bold text-[#2F3E32]">{activityCount} tasks</span>
               </div>
             </div>
          )}
        </div>
      );
    }
    return days;
  };

  const nextMonth = () => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(next);
  };
  const prevMonth = () => {
    const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(prev);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in">
      {/* Calendar Grid */}
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-[#2F3E32]">
            {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-[#E8E4D9] rounded-full text-[#2F3E32]"><ChevronLeft size={20} /></button>
            <button onClick={nextMonth} className="p-2 hover:bg-[#E8E4D9] rounded-full text-[#2F3E32]"><ChevronRight size={20} /></button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-xs font-bold text-[#A9B388] uppercase tracking-widest pb-2">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 border border-[#E8E4D9] rounded-lg overflow-hidden shadow-md">
          {generateDays()}
        </div>
      </div>
      
      {/* Task List for Selected Day */}
      <div className="lg:col-span-1 bg-[#F6F4EE] p-6 rounded-2xl border border-[#E8E4D9] shadow-inner">
        <h3 className="font-serif text-xl text-[#2F3E32] mb-4 border-b border-[#E8E4D9] pb-2">
          Schedule for: {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </h3>

        {filteredTasksByDate.length === 0 ? (
          <div className="text-center py-8 text-stone-500 font-serif">
            <Clock size={32} className="mx-auto mb-3" />
            <p>No scheduled tasks for this day.</p>
            <p className="text-sm mt-1">Add tasks via the Bank and assign a due date.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasksByDate.map(task => (
              <div key={task.id} className="p-3 bg-white border border-[#E8E4D9] rounded-xl shadow-sm flex justify-between items-center group">
                <div>
                  <span className="text-[10px] font-bold text-[#A9B388] uppercase tracking-widest">{task.subject}</span>
                  <p className="font-serif text-base text-[#2F3E32]">{task.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500">{task.duration}m</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(task)}
                      className="p-1 text-stone-400 hover:text-[#CB8F46] hover:bg-stone-50 rounded-full transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => onDelete(task.id)}
                      className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Day Schedule Modal */}
      <ModalWrapper
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        title={`Schedule: ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
      >
        {filteredTasksByDate.length === 0 ? (
          <div className="text-center py-8 text-stone-500 font-serif">
            <Clock size={32} className="mx-auto mb-3" />
            <p>No scheduled tasks for this day.</p>
            <p className="text-sm mt-1">Add tasks via the Bank and assign a due date.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {filteredTasksByDate.map(task => (
              <div key={task.id} className="p-3 bg-white border border-[#E8E4D9] rounded-xl shadow-sm flex justify-between items-center group">
                <div>
                  <span className="text-[10px] font-bold text-[#A9B388] uppercase tracking-widest">{task.subject}</span>
                  <p className="font-serif text-base text-[#2F3E32]">{task.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500">{task.duration}m</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(task)}
                      className="p-1 text-stone-400 hover:text-[#CB8F46] hover:bg-stone-50 rounded-full transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => onDelete(task.id)}
                      className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ModalWrapper>
    </div>
  );
};


// --- Main App Component ---

export default function App() {
  const [showLanding, setShowLanding] = useState(() => {
    return localStorage.getItem('kairos_has_started') !== 'true';
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStudentId, setActiveStudentId] = useState(null);
  const [students, setStudents] = useState([]);
  const [rhythms, setRhythms] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showSickDayModal, setShowSickDayModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showRhythmsModal, setShowRhythmsModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false); // New State for CSV Import
  const [showReportsModal, setShowReportsModal] = useState(false); // New State for Reports
  const [aiReport, setAiReport] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [viewMode, setViewMode] = useState('today'); // 'today' | 'bank' | 'calendar'
  
  // New State for Rhythm Filtering
  const [activeRhythmId, setActiveRhythmId] = useState(null);
  const [isLinking, setIsLinking] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!user) return;
    setIsLinking(true);
    const provider = new GoogleAuthProvider();
    try {
      if (user.isAnonymous) {
        await linkWithPopup(user, provider);
        alert("Successfully linked to Google! Your data is now safe.");
      } else {
        alert("You are already signed in with a permanent account.");
      }
    } catch (error) {
      console.error("Error linking with Google", error);
      if (error.code === 'auth/credential-already-in-use') {
         if (window.confirm("This Google account is already associated with another portfolio. Switch to it? (Current unsaved data will be lost)")) {
            await signInWithPopup(auth, provider);
         }
      } else {
        alert("Failed to link account: " + error.message);
      }
    } finally {
      setIsLinking(false);
    }
  }; 

  // Mapping from Rhythm Names to the Subjects they contain
  const RHYTHM_SUBJECT_MAP = useMemo(() => {
    return {
      'Morning Basket': ['Copywork', 'Recitation', 'Composer Study', 'Solfa/Hymn', 'Poetry', 'History'],
      'Nature Study': ['Nature Study', 'Artist Study', 'Handicrafts', 'Service'],
      'Recitation Time': ['Recitation', 'Poetry'],
      'Academic Block': ['Math', 'Reading'],
      'Habit Training': ['Habit Training', 'Service'],
      'Service': ['Service'],
    };
  }, []);

  // 1. Auth Init
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      
      // If user has started before but is not logged in, sign in anonymously
      // This handles page reloads for anonymous users
      if (!u && localStorage.getItem('kairos_has_started') === 'true') {
        signInAnonymously(auth).catch(err => {
          // Only log error if it's not a "multiple auth" race condition
          console.error("Auto-auth failed", err);
        });
      }
    });
    return unsubscribe;
  }, []);

  // 2. Data Listeners (Unchanged)
  useEffect(() => {
    if (!user) return;

    // Load Students
    const studentsRef = getUserCollectionRef('profiles', user.uid);
    const unsubStudents = onSnapshot(studentsRef, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setStudents(data);
      if (data.length > 0 && !activeStudentId) {
        setActiveStudentId(data[0].id);
      }
      if (data.length === 0) {
        seedDemoData(user.uid);
      }
      setLoading(false);
    }, (err) => console.error(err));
    
    // Load Rhythms
    const rhythmsRef = getUserCollectionRef('rhythms', user.uid);
    const unsubRhythms = onSnapshot(rhythmsRef, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setRhythms(data);
    }, (err) => console.error(err));


    // Load Assignments
    const assignRef = getUserCollectionRef('assignments', user.uid);
    const unsubAssign = onSnapshot(assignRef, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setAssignments(data);
    }, (err) => console.error(err));

    return () => {
      unsubStudents();
      unsubRhythms();
      unsubAssign();
    };
  }, [user, activeStudentId]);

  // --- Actions ---

  const seedDemoData = async (uid) => {
    const studentsRef = getUserCollectionRef('profiles', uid);
    const assignRef = getUserCollectionRef('assignments', uid);
    const rhythmsRef = getUserCollectionRef('rhythms', uid);
    
    // 1. Default Rhythms
    await addDoc(rhythmsRef, { name: 'Morning Basket', icon: 'Coffee', color: 'orange' });
    await addDoc(rhythmsRef, { name: 'Nature Study', icon: 'Leaf', color: 'green' });
    await addDoc(rhythmsRef, { name: 'Recitation Time', icon: 'BookOpen', color: 'blue' });
    await addDoc(rhythmsRef, { name: 'Academic Block', icon: 'Brain', color: 'sage' }); 
    await addDoc(rhythmsRef, { name: 'Habit Training', icon: 'Sparkles', color: 'pink' });
    
    // 2. Students
    const frank = await addDoc(studentsRef, { display_name: 'Frank', age: 9, color: 'blue' });
    const leo = await addDoc(studentsRef, { display_name: 'Leo', age: 7, color: 'green' });
    const maya = await addDoc(studentsRef, { display_name: 'Maya', age: 4, color: 'pink' });
    
    // 3. Generate Tasks
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // FIXED: Helper to format date YYYY-MM-DD in Local Time
    // Prevents "previous day" shift caused by toISOString() in Western timezones
    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };
    
    // Generate dates for the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const tasks = [];

    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(currentYear, currentMonth, i);
        const dayOfWeek = d.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends
        const dateStr = formatDate(d);
        
        // --- FRANK (Age 9 - Year 4) ---
        // Morning Basket (Shared)
        tasks.push({ title: 'Hymn: Amazing Grace', subject: 'Solfa/Hymn', duration: '10', studentId: frank.id, status: 'bank', type: 'Lesson', dueDate: dateStr });
        tasks.push({ title: 'Bible: Judges Ch ' + i, subject: 'Reading', duration: '15', studentId: frank.id, status: 'bank', type: 'Lesson', dueDate: dateStr });
        tasks.push({ title: 'Composer: Bach - Cello Suite', subject: 'Composer Study', duration: '10', studentId: frank.id, status: 'bank', type: 'Lesson', dueDate: dateStr });
        
        // Recitation
        tasks.push({ title: 'Recitation: Psalm 100', subject: 'Recitation', duration: '5', studentId: frank.id, status: 'bank', type: 'Lesson', dueDate: dateStr });
        
        // Academics
        tasks.push({ title: `Math: Exercise ${i + 20}`, subject: 'Math', duration: '30', studentId: frank.id, status: 'bank', type: 'Lesson', dueDate: dateStr });
        tasks.push({ title: `Latin: Lesson ${Math.ceil(i/3)}`, subject: 'Math', duration: '20', studentId: frank.id, status: 'bank', type: 'Lesson', dueDate: dateStr }); 
        tasks.push({ title: `Literature: Robinson Crusoe Ch ${Math.ceil(i/2)}`, subject: 'Reading', duration: '20', studentId: frank.id, status: 'bank', type: 'Lesson', dueDate: dateStr });
        
        // Nature Study (Tuesdays/Thursdays)
        if (dayOfWeek === 2 || dayOfWeek === 4) {
             tasks.push({ title: 'Nature Journal: Oak Trees', subject: 'Nature Study', duration: '20', studentId: frank.id, status: 'bank', type: 'Lesson', dueDate: dateStr });
        }

        // --- LEO (Age 7 - Year 1) ---
        // Morning Basket (Shared)
        tasks.push({ title: 'Hymn: Amazing Grace (Chorus)', subject: 'Solfa/Hymn', duration: '10', studentId: leo.id, status: 'bank', type: 'Lesson', dueDate: dateStr });
        tasks.push({ title: 'Poetry: A.A. Milne', subject: 'Poetry', duration: '10', studentId: leo.id, status: 'bank', type: 'Lesson', dueDate: dateStr });
        
        // Recitation
        tasks.push({ title: 'Recitation: The Caterpillar', subject: 'Recitation', duration: '5', studentId: leo.id, status: 'bank', type: 'Lesson', dueDate: dateStr });
        
        // Academics
        tasks.push({ title: `Copywork: Poem Line ${i}`, subject: 'Copywork', duration: '10', studentId: leo.id, status: 'bank', type: 'Lesson', dueDate: dateStr });
        tasks.push({ title: `Phonics: Letter Sound '${String.fromCharCode(97 + (i % 26))}'`, subject: 'Reading', duration: '15', studentId: leo.id, status: 'bank', type: 'Lesson', dueDate: dateStr });
        tasks.push({ title: `Math: Counting Beans`, subject: 'Math', duration: '15', studentId: leo.id, status: 'bank', type: 'Lesson', dueDate: dateStr });

        // Nature Study (Tuesdays/Thursdays)
        if (dayOfWeek === 2 || dayOfWeek === 4) {
            tasks.push({ title: 'Nature Hunt: Insects', subject: 'Nature Study', duration: '15', studentId: leo.id, status: 'bank', type: 'Lesson', dueDate: dateStr });
        }

        // --- MAYA (Age 4 - Early Years) ---
        // Habits & Atmosphere
        tasks.push({ title: 'Habit: Brush Teeth', subject: 'Habit Training', duration: '5', studentId: maya.id, status: 'bank', type: 'Chore', dueDate: dateStr });
        tasks.push({ title: 'Habit: Put Away Shoes', subject: 'Habit Training', duration: '5', studentId: maya.id, status: 'bank', type: 'Chore', dueDate: dateStr });
        
        // Gentle Learning
        tasks.push({ title: 'Picture Study: Van Gogh Sunflowers', subject: 'Artist Study', duration: '5', studentId: maya.id, status: 'bank', type: 'Lesson', dueDate: dateStr });
        tasks.push({ title: 'Read Aloud: Beatrix Potter', subject: 'Reading', duration: '15', studentId: maya.id, status: 'bank', type: 'Lesson', dueDate: dateStr });
        
        // Outdoor Play (MWF)
        if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
             tasks.push({ title: 'Nature: Outdoor Play', subject: 'Nature Study', duration: '30', studentId: maya.id, status: 'bank', type: 'Lesson', dueDate: dateStr });
        }
    }

    // Batch add
    const todayStr = formatDate(today);
    
    for (const t of tasks) {
        // Mark today's tasks as either pending or completed to show progress
        if (t.dueDate === todayStr) {
            t.status = Math.random() > 0.6 ? 'completed' : 'today';
        }
        await addDoc(assignRef, { ...t, createdAt: serverTimestamp() });
    }
  };

  const handleAddAssignment = async (data) => {
    if (!user) return;
    try {
      await addDoc(getUserCollectionRef('assignments', user.uid), {
        ...data,
        status: data.dueDate ? 'bank' : 'bank', // Tasks added manually go to bank, calendar assignment is separate
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    if (!user) return;
    const taskRef = doc(getUserCollectionRef('assignments', user.uid), taskId);
    await updateDoc(taskRef, taskData);
  };

  const handleDeleteTask = async (taskId) => {
    if (!user) return;
    if (window.confirm('Are you sure you want to delete this task?')) {
      const taskRef = doc(getUserCollectionRef('assignments', user.uid), taskId);
      await deleteDoc(taskRef);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleBulkAddAssignments = async (records) => {
    if (!user) return;
    const assignRef = getUserCollectionRef('assignments', user.uid);
    
    const batchPromises = records.map(record => {
      const taskData = {
        title: record.title,
        subject: record.subject,
        duration: record.duration,
        studentId: record.studentId,
        dueDate: record.dueDate,
        status: 'bank', // Imported tasks go to the bank initially
        type: 'Lesson', // Default type
        createdAt: serverTimestamp()
      };
      return addDoc(assignRef, taskData);
    });

    await Promise.all(batchPromises);
    console.log(`Successfully imported ${records.length} tasks.`);
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    if (!user) return;
    const newStatus = currentStatus === 'completed' ? 'today' : 'completed';
    const taskRef = doc(getUserCollectionRef('assignments', user.uid), taskId);
    
    const updateData = { status: newStatus };
    if (newStatus === 'completed') {
      updateData.completedAt = serverTimestamp();
    } else {
      updateData.completedAt = null;
    }

    await updateDoc(taskRef, updateData);
  };

  const moveFromBankToToday = async (taskId) => {
    if (!user) return;
    const taskRef = doc(getUserCollectionRef('assignments', user.uid), taskId);
    await updateDoc(taskRef, { status: 'today', dueDate: null }); // Remove due date if moved to Today's schedule
  };

  const handleSickDay = async () => {
    if (!user) return;
    const todayTasks = assignments.filter(a => a.studentId === activeStudentId && a.status === 'today');
    const batchPromises = todayTasks.map(task => {
       const taskRef = doc(getUserCollectionRef('assignments', user.uid), task.id);
       return updateDoc(taskRef, { status: 'bank' });
    });
    await Promise.all(batchPromises);
    setShowSickDayModal(false);
  };

  const generateReport = async () => {
    if (!activeStudentId) return;
    setGeneratingReport(true);
    const student = students.find(s => s.id === activeStudentId);
    const completed = assignments.filter(a => a.studentId === activeStudentId && a.status === 'completed');
    
    const summary = await generatePortfolioSummary(student.display_name, completed);
    setAiReport(summary);
    setGeneratingReport(false);
  };

  // --- UI Helpers ---
  const activeStudent = students.find(s => s.id === activeStudentId);
  
  // Filtering Logic based on Rhythms
  const getFilteredTasks = (tasks) => {
    if (!activeRhythmId) return tasks;

    const activeRhythm = rhythms.find(r => r.id === activeRhythmId);
    if (!activeRhythm) return tasks;
    
    const subjectsToInclude = RHYTHM_SUBJECT_MAP[activeRhythm.name] || [activeRhythm.name]; 

    return tasks.filter(task => subjectsToInclude.includes(task.subject));
  };
  
  const allActiveTasks = assignments.filter(a => a.studentId === activeStudentId);
  
  // Today's tasks exclude those with a due date that IS NOT today
  const todayTasks = getFilteredTasks(
    allActiveTasks.filter(a => a.status === 'today' || a.status === 'completed')
    // TODO: Add logic here to include tasks where dueDate === today AND status === 'bank'
  );
  
  const bankedTasks = getFilteredTasks(
    allActiveTasks.filter(a => a.status === 'bank')
  );

  const completionPercentage = useMemo(() => {
    const todayUnfiltered = allActiveTasks.filter(a => a.status === 'today' || a.status === 'completed');
    if (todayUnfiltered.length === 0) return 0;
    const completed = todayUnfiltered.filter(t => t.status === 'completed').length;
    return Math.round((completed / todayUnfiltered.length) * 100);
  }, [allActiveTasks]);

  const handleGetStarted = async () => {
    localStorage.setItem('kairos_has_started', 'true');
    setShowLanding(false);
    if (!user) {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Failed to sign in anonymously", err);
      }
    }
  };

  const handleSignOut = async () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      try {
        await signOut(auth);
        localStorage.removeItem('kairos_has_started');
        setShowLanding(true);
        setStudents([]);
        setRhythms([]);
        setAssignments([]);
        setActiveStudentId(null);
      } catch (error) {
        console.error("Error signing out", error);
      }
    }
  };

  if (loading) return <LoadingScreen />;
  if (showLanding) return <LandingPage onGetStarted={handleGetStarted} />;

  return (
    <div className="flex h-dvh bg-[#FDFBF7] text-[#2F3E32] font-sans overflow-hidden">
      
      {/* --- Sidebar (Desktop) --- */}
      <nav className="hidden md:flex flex-col w-72 bg-[#F6F4EE] border-r border-[#E8E4D9] p-6 justify-between relative">
        {/* Background Texture Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-[#5F6F52] p-2 rounded-lg shadow-sm text-white">
              <Flower size={24} />
            </div>
            <span className="font-serif text-2xl tracking-widest text-[#2F3E32] font-bold">KAIRÓS</span>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-xs font-bold text-[#A9B388] uppercase tracking-widest font-serif">The Children</h3>
                <button onClick={() => setShowStudentModal(true)} className="text-[#A9B388] hover:text-[#5F6F52] transition-colors"><Settings size={14} /></button>
              </div>
              <div className="space-y-2">
                {students.map(s => {
                  const colorClass = COLOR_OPTIONS.find(c => c.value === s.color)?.class || COLOR_OPTIONS[0].class;
                  return (
                    <button
                      key={s.id}
                      onClick={() => { setActiveStudentId(s.id); setAiReport(null); }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all border ${activeStudentId === s.id ? 'bg-white border-[#E8E4D9] shadow-sm text-[#2F3E32]' : 'border-transparent text-stone-500 hover:bg-[#E8E4D9]/50'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm ${colorClass}`}>
                        {s.display_name[0]}
                      </div>
                      <span className="font-medium font-serif">{s.display_name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-xs font-bold text-[#A9B388] uppercase tracking-widest font-serif">Rhythms</h3>
                <button onClick={() => setShowRhythmsModal(true)} className="text-[#A9B388] hover:text-[#5F6F52] transition-colors"><Settings size={14} /></button>
              </div>
              
              {/* All Tasks Button (to clear filter) */}
              <button
                onClick={() => setActiveRhythmId(null)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-stone-600 rounded-lg transition-colors group mb-2 font-serif text-sm ${!activeRhythmId ? 'bg-white shadow-sm font-bold text-[#2F3E32]' : 'hover:bg-[#E8E4D9]/50'}`}
              >
                  <Grid size={16} className={`w-6 h-6 ${!activeRhythmId ? 'text-[#2F3E32]' : 'text-[#A9B388]'}`} />
                  All Tasks
              </button>

              <div className="space-y-2">
                {rhythms.map(rhythm => {
                  const ItemIcon = ICON_OPTIONS[rhythm.icon] || Sparkles;
                  const colorClass = COLOR_OPTIONS.find(c => c.value === rhythm.color)?.class || COLOR_OPTIONS[0].class;
                  const isActive = activeRhythmId === rhythm.id;
                  
                  return (
                    <button
                      key={rhythm.id}
                      onClick={() => setActiveRhythmId(rhythm.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group font-serif text-sm ${isActive ? 'bg-white shadow-sm font-bold text-[#2F3E32]' : 'text-stone-600 hover:bg-[#E8E4D9]/50'}`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${colorClass}`}>
                        <ItemIcon size={14} className="text-[#2F3E32]" />
                      </div>
                      <span>{rhythm.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reports Section */}
            <div>
              <div className="flex justify-between items-center mb-2 px-2">
                <h3 className="text-xs font-bold text-[#A9B388] uppercase tracking-widest font-serif">Reports</h3>
              </div>
              <button
                onClick={() => setShowReportsModal(true)}
                className="w-full flex items-center gap-3 px-3 py-2 text-stone-600 rounded-lg transition-colors hover:bg-[#E8E4D9]/50 font-serif text-sm"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-stone-100">
                  <Printer size={14} className="text-[#2F3E32]" />
                </div>
                <span>Print Portfolio</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 bg-[#E8E4D9]/40 rounded-xl border border-[#E8E4D9]">
          <Feather size={16} className="text-[#A9B388] mb-2" />
          <p className="text-sm text-[#2F3E32] font-serif italic leading-relaxed">
            "We are not merely teaching children; we are unveiling the world to them."
          </p>
          
          {user && user.isAnonymous && (
            <button 
              onClick={handleGoogleSignIn}
              disabled={isLinking}
              className="w-full flex items-center justify-center gap-2 mt-3 text-xs font-bold text-[#2F3E32] hover:text-[#5F6F52] bg-white border border-[#E8E4D9] p-2 rounded-lg transition-colors uppercase tracking-widest shadow-sm"
            >
              {isLinking ? 'Linking...' : 'Sync with Google'}
            </button>
          )}

          {user && !user.isAnonymous ? (
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 mt-3 text-xs font-bold text-stone-500 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 p-2 rounded-lg transition-colors uppercase tracking-widest"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem('kairos_has_started');
                setShowLanding(true);
              }}
              className="w-full flex items-center justify-center gap-2 mt-3 text-xs font-bold text-stone-500 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 p-2 rounded-lg transition-colors uppercase tracking-widest"
            >
              <LogOut size={14} />
              Back to Home
            </button>
          )}

          <button 
            onClick={() => setShowSickDayModal(true)}
            className="w-full flex items-center justify-center gap-2 mt-3 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors uppercase tracking-widest"
          >
            <Umbrella size={14} />
            Grace Period
          </button>
        </div>
      </nav>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="min-h-20 pt-safe border-b border-[#E8E4D9] bg-[#FDFBF7] flex items-center justify-between px-4 md:px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-serif text-[#2F3E32]">
                {activeStudent ? `${activeStudent.display_name}'s Journal` : 'Dashboard'}
              </h1>
              <p className="text-xs text-[#A9B388] font-bold tracking-widest uppercase mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                {activeRhythmId && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-[#CB8F46]/20 text-[#CB8F46] font-medium normal-case font-serif italic">
                    {rhythms.find(r => r.id === activeRhythmId)?.name} Filtered
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-[#F6F4EE] p-1.5 rounded-xl flex border border-[#E8E4D9]">
              <button 
                onClick={() => setViewMode('today')}
                className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all font-serif ${viewMode === 'today' ? 'bg-white shadow-sm text-[#2F3E32]' : 'text-stone-400 hover:text-stone-600'}`}
              >
                Today
              </button>
              <button 
                onClick={() => setViewMode('bank')}
                className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all font-serif ${viewMode === 'bank' ? 'bg-white shadow-sm text-[#2F3E32]' : 'text-stone-400 hover:text-stone-600'}`}
              >
                The Bank
              </button>
              <button 
                onClick={() => setViewMode('calendar')}
                className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all font-serif flex items-center gap-2 ${viewMode === 'calendar' ? 'bg-white shadow-sm text-[#2F3E32]' : 'text-stone-400 hover:text-stone-600'}`}
              >
                <CalendarIcon size={14} />
                <span className="hidden sm:inline">Calendar</span>
              </button>
            </div>
            <button 
              onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
              className="bg-[#2F3E32] text-[#F9F7F2] rounded-xl px-3 md:px-5 py-2 text-sm font-medium hover:bg-[#1A231C] transition-colors flex items-center gap-2 shadow-lg shadow-[#2F3E32]/10 font-serif"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Entry</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-10 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]">
          <div className="max-w-4xl mx-auto">
            
            {/* View: Today */}
            {viewMode === 'today' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4">
                {/* Progress Bar */}
                <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-[#E8E4D9] shadow-sm">
                    <div className="bg-[#F6F4EE] p-3 rounded-full">
                      <Clock size={24} className="text-[#A9B388]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-[#A9B388] uppercase tracking-widest">Daily Rhythms</span>
                        <span className="text-xs font-bold text-[#2F3E32]">{completionPercentage}% Complete</span>
                      </div>
                      <div className="h-2 bg-[#F6F4EE] rounded-full overflow-hidden">
                        <div className="h-full bg-[#A9B388] transition-all duration-1000 ease-out" style={{ width: `${completionPercentage}%` }} />
                      </div>
                    </div>
                </div>

                {todayTasks.length === 0 ? (
                  <div className="text-center py-24 opacity-60">
                    <Leaf size={64} className="mx-auto mb-6 text-[#A9B388]" />
                    <p className="text-2xl font-serif text-[#2F3E32] italic">"The mind feeds on ideas."</p>
                    <p className="text-stone-500 mt-2 font-serif">The schedule is clear. Enjoy the outdoors.</p>
                    <button 
                      onClick={() => setViewMode('bank')}
                      className="mt-6 text-[#5F6F52] font-bold hover:underline font-serif"
                    >
                      Retrieve Lessons from Bank
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {todayTasks.map(task => (
                      <div 
                        key={task.id}
                        className={`group relative flex items-center p-5 bg-white rounded-xl border transition-all duration-300 ${task.status === 'completed' ? 'border-[#E8E4D9] bg-[#FDFBF7] opacity-70' : 'border-[#E8E4D9] shadow-sm hover:shadow-md hover:border-[#A9B388]/50'}`}
                      >
                        <button 
                          onClick={() => toggleTaskStatus(task.id, task.status)}
                          className={`mr-5 transition-colors ${task.status === 'completed' ? 'text-[#5F6F52]' : 'text-[#E8E4D9] group-hover:text-[#A9B388]'}`}
                        >
                          {task.status === 'completed' ? <CheckCircle size={32} className="fill-[#F6F4EE]" /> : <Circle size={32} />}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1.5">
                             <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded text-[#2F3E32]/70 bg-[#F6F4EE] border border-[#E8E4D9]`}>
                               {task.subject}
                             </span>
                             {task.duration && (
                               <span className="flex items-center gap-1 text-[10px] font-medium text-stone-400">
                                 <Clock size={10} /> {task.duration}m
                               </span>
                             )}
                          </div>
                          <h3 className={`font-serif text-xl ${task.status === 'completed' ? 'text-stone-400 line-through decoration-[#A9B388]/50' : 'text-[#2F3E32]'}`}>
                            {task.title}
                          </h3>
                        </div>

                        {task.status === 'completed' ? (
                           <span className="text-xs text-[#A9B388] font-bold tracking-widest uppercase px-2">Completed</span>
                        ) : (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditTask(task)}
                              className="p-2 text-stone-400 hover:text-[#CB8F46] hover:bg-stone-50 rounded-full transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* AI Portfolio Generation */}
                {todayTasks.some(t => t.status === 'completed') && (
                  <div className="mt-12 p-6 bg-[#F6F4EE] rounded-2xl border border-[#E8E4D9]">
                    <div className="flex items-start gap-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-[#E8E4D9]">
                        <Brain size={24} className="text-[#A9B388]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-lg text-[#2F3E32]">Narration Assistant</h4>
                        <p className="text-sm text-stone-600 mb-4 font-serif">
                          Shall I compose a summary of today's learning for the records?
                        </p>
                        
                        {!aiReport ? (
                          <button 
                            onClick={generateReport}
                            disabled={generatingReport}
                            className="text-sm bg-white border border-[#E8E4D9] px-5 py-2.5 rounded-xl font-medium text-[#2F3E32] hover:bg-stone-50 disabled:opacity-50 transition-colors shadow-sm font-serif"
                          >
                            {generatingReport ? 'Composing...' : 'Generate Narrative Summary'}
                          </button>
                        ) : (
                          <div className="bg-white p-6 rounded-xl border border-[#E8E4D9] text-[#2F3E32] font-serif leading-loose animate-in fade-in shadow-sm relative">
                            <Feather size={120} className="absolute -right-10 -bottom-10 text-stone-50 rotate-12" />
                            <div className="relative z-10">
                              {aiReport}
                            </div>
                            <div className="mt-4 pt-4 border-t border-[#E8E4D9] flex justify-end gap-3 relative z-10">
                              <button onClick={() => setAiReport(null)} className="text-xs font-bold text-stone-400 hover:text-stone-600 uppercase tracking-widest">Discard</button>
                              <button className="text-xs font-bold text-[#5F6F52] hover:text-[#2F3E32] uppercase tracking-widest">Save to Journal</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* View: Bank */}
            {viewMode === 'bank' && (
              <div className="animate-in slide-in-from-bottom-4">
                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h2 className="font-serif text-3xl text-[#2F3E32] mb-1">The Lesson Bank</h2>
                    <p className="text-stone-500 font-serif italic">"Let the lesson be short and the attention perfect."</p>
                    {activeRhythmId && (
                      <p className="text-sm font-serif text-[#CB8F46] mt-1">Showing only tasks for the {rhythms.find(r => r.id === activeRhythmId)?.name} rhythm.</p>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowImportModal(true)}
                    className="flex items-center gap-2 text-sm font-bold text-[#5F6F52] bg-[#F6F4EE] px-4 py-2 rounded-xl hover:bg-[#E8E4D9] transition-colors uppercase tracking-wide shadow-sm"
                  >
                    <Upload size={14} /> Import CSV
                  </button>
                </div>

                <div className="space-y-3">
                  {bankedTasks.length === 0 ? (
                    <div className="p-10 border-2 border-dashed border-[#E8E4D9] rounded-2xl text-center bg-[#F6F4EE]/50">
                      <p className="text-[#A9B388] font-serif mb-3">
                          {activeRhythmId ? `The bank is empty for ${rhythms.find(r => r.id === activeRhythmId)?.name}.` : "The bank is empty."}
                      </p>
                      <button onClick={() => setShowAddModal(true)} className="text-[#2F3E32] font-bold border-b-2 border-[#A9B388] hover:border-[#5F6F52] transition-colors pb-0.5">Add Living Books & Lessons</button>
                    </div>
                  ) : (
                    bankedTasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-5 bg-white border border-[#E8E4D9] rounded-xl hover:border-[#A9B388] transition-colors shadow-sm">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-[#A9B388] uppercase tracking-widest">{task.subject}</span>
                            {task.duration && <span className="text-[10px] text-stone-400 bg-stone-100 px-1.5 rounded">{task.duration}m</span>}
                          </div>
                          <h3 className="font-serif text-lg text-[#2F3E32]">{task.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEditTask(task)}
                            className="p-2 text-stone-400 hover:text-[#CB8F46] hover:bg-stone-50 rounded-full transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button 
                            onClick={() => moveFromBankToToday(task.id)}
                            className="flex items-center gap-2 text-sm font-bold text-[#5F6F52] bg-[#F6F4EE] px-4 py-2 rounded-lg hover:bg-[#E8E4D9] transition-colors uppercase tracking-wide ml-2"
                          >
                            <span>Assign</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* View: Calendar */}
            {viewMode === 'calendar' && (
              <div className="animate-in slide-in-from-bottom-4">
                  <CalendarView 
                    tasks={getFilteredTasks(assignments)} 
                    activeStudentId={activeStudentId}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
              </div>
            )}

          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden bg-white border-t border-[#E8E4D9] px-4 py-2 flex justify-around items-center z-20 pb-safe shadow-lg">
           {students.slice(0, 3).map(s => {
              const colorClass = COLOR_OPTIONS.find(c => c.value === s.color)?.class || COLOR_OPTIONS[0].class;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStudentId(s.id)}
                  className={`flex flex-col items-center gap-1 transition-all ${activeStudentId === s.id ? 'opacity-100' : 'opacity-50'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${activeStudentId === s.id ? `border-[#5F6F52]` : 'border-transparent'} ${colorClass}`}>
                      <span className="text-sm font-bold font-serif">{s.display_name[0]}</span>
                  </div>
                  <span className="text-[10px] font-medium text-stone-600 font-serif">{s.display_name}</span>
                </button>
              );
           })}
           <button
             onClick={() => setShowMobileMenu(true)}
             className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100"
           >
             <div className="w-10 h-10 rounded-full bg-[#F6F4EE] flex items-center justify-center border-2 border-transparent">
               <Menu size={20} className="text-[#5F6F52]" />
             </div>
             <span className="text-[10px] font-medium text-stone-600 font-serif">More</span>
           </button>
        </div>

        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <div
              className="absolute inset-0 bg-[#2F3E32]/20 backdrop-blur-sm"
              onClick={() => setShowMobileMenu(false)}
            />
            <div className="relative bg-[#FDFBF7] rounded-t-3xl border-t border-[#E8E4D9] p-6 pb-safe animate-in slide-in-from-bottom-10">
              <div className="w-12 h-1 bg-[#E8E4D9] rounded-full mx-auto mb-6" />

              <div className="grid grid-cols-4 gap-4 mb-6">
                {students.map(s => {
                  const colorClass = COLOR_OPTIONS.find(c => c.value === s.color)?.class || COLOR_OPTIONS[0].class;
                  return (
                    <button
                      key={s.id}
                      onClick={() => { setActiveStudentId(s.id); setShowMobileMenu(false); }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${activeStudentId === s.id ? 'bg-white shadow-sm border border-[#E8E4D9]' : ''}`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                        <span className="text-base font-bold font-serif">{s.display_name[0]}</span>
                      </div>
                      <span className="text-xs font-medium text-[#2F3E32] font-serif">{s.display_name}</span>
                    </button>
                  );
                })}
                <button
                  onClick={() => { setShowStudentModal(true); setShowMobileMenu(false); }}
                  className="flex flex-col items-center gap-2 p-3"
                >
                  <div className="w-12 h-12 rounded-full bg-[#E8E4D9] flex items-center justify-center border-2 border-dashed border-[#A9B388]">
                    <Plus size={20} className="text-[#5F6F52]" />
                  </div>
                  <span className="text-xs font-medium text-stone-500 font-serif">Add</span>
                </button>
              </div>

              <div className="border-t border-[#E8E4D9] pt-4 space-y-2">
                <button
                  onClick={() => { setShowRhythmsModal(true); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#F6F4EE] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Coffee size={18} className="text-orange-600" />
                  </div>
                  <span className="font-serif text-[#2F3E32]">Manage Rhythms</span>
                </button>

                <button
                  onClick={() => { setShowReportsModal(true); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#F6F4EE] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Printer size={18} className="text-blue-600" />
                  </div>
                  <span className="font-serif text-[#2F3E32]">Print Portfolio</span>
                </button>

                <button
                  onClick={() => { setShowImportModal(true); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#F6F4EE] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Upload size={18} className="text-green-600" />
                  </div>
                  <span className="font-serif text-[#2F3E32]">Import Tasks (CSV)</span>
                </button>
              </div>

              <div className="border-t border-[#E8E4D9] pt-4 mt-4 space-y-2">
                {user && user.isAnonymous && (
                  <button
                    onClick={() => { handleGoogleSignIn(); setShowMobileMenu(false); }}
                    disabled={isLinking}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-white border border-[#E8E4D9] shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#F6F4EE] flex items-center justify-center">
                      <User size={18} className="text-[#5F6F52]" />
                    </div>
                    <span className="font-serif text-[#2F3E32]">{isLinking ? 'Linking...' : 'Sync with Google'}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    if (user && !user.isAnonymous) {
                      handleSignOut();
                    } else {
                      localStorage.removeItem('kairos_has_started');
                      setShowLanding(true);
                    }
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-stone-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                    <LogOut size={18} className="text-stone-500" />
                  </div>
                  <span className="font-serif text-stone-500">{user && !user.isAnonymous ? 'Sign Out' : 'Back to Home'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <TaskModal 
        isOpen={showTaskModal} 
        onClose={() => { setShowTaskModal(false); setEditingTask(null); }} 
        studentId={activeStudentId}
        onAdd={handleAddAssignment}
        onEdit={handleUpdateTask}
        taskToEdit={editingTask}
      />
      <SickDayModal 
        isOpen={showSickDayModal} 
        onClose={() => setShowSickDayModal(false)}
        onConfirm={handleSickDay}
      />
      <StudentModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        userId={user?.uid}
        students={students}
        setActiveStudentId={setActiveStudentId}
      />
      <RhythmsModal
        isOpen={showRhythmsModal}
        onClose={() => setShowRhythmsModal(false)}
        userId={user?.uid}
        rhythms={rhythms}
        setRhythms={setRhythms}
      />
      <ReportsModal
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
        students={students}
        assignments={assignments}
        activeStudentId={activeStudentId}
      />
      <ImportCSVModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        userId={user?.uid}
        students={students}
        onBulkAdd={handleBulkAddAssignments}
      />
    </div>
  );
}
