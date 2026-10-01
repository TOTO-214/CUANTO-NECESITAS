import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calculator,
  Sliders,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  BookOpen,
  Printer,
  Info,
  Layers,
  Settings,
  X,
  FileCode,
  Download,
  HelpCircle,
  Target
} from 'lucide-react';

// ==========================================
// Tipos y Presets de Escalas
// ==========================================

export interface ScalePreset {
  id: string;
  name: string;
  country: string;
  min: number;
  max: number;
  step: number;
  decimals: number;
  defaultPass: number;
  defaultExpected: number;
  defaultGoal: number;
}

export const SCALE_PRESETS: ScalePreset[] = [
  {
    id: 'scale-0-5',
    name: 'Escala 0 a 5.0',
    country: 'Colombia y otros',
    min: 0,
    max: 5.0,
    step: 0.1,
    decimals: 2,
    defaultPass: 3.0,
    defaultExpected: 3.8,
    defaultGoal: 4.5,
  },
  {
    id: 'scale-0-10',
    name: 'Escala 0 a 10',
    country: 'México, España, Argentina',
    min: 0,
    max: 10.0,
    step: 0.1,
    decimals: 1,
    defaultPass: 6.0,
    defaultExpected: 8.0,
    defaultGoal: 9.5,
  },
  {
    id: 'scale-0-20',
    name: 'Escala 0 a 20',
    country: 'Perú, Venezuela',
    min: 0,
    max: 20.0,
    step: 0.5,
    decimals: 1,
    defaultPass: 10.5,
    defaultExpected: 14.0,
    defaultGoal: 18.0,
  },
  {
    id: 'scale-0-100',
    name: 'Escala 0 a 100',
    country: 'Bolivia, EE. UU. (%), México Univ.',
    min: 0,
    max: 100,
    step: 1,
    decimals: 0,
    defaultPass: 60,
    defaultExpected: 80,
    defaultGoal: 92,
  },
  {
    id: 'scale-1-7',
    name: 'Escala 1.0 a 7.0',
    country: 'Chile',
    min: 1.0,
    max: 7.0,
    step: 0.1,
    decimals: 1,
    defaultPass: 4.0,
    defaultExpected: 5.5,
    defaultGoal: 6.5,
  },
];

export interface Activity {
  id: string;
  name: string;
  weight: number; // Porcentaje (%)
  score: number | null; // null si no ha sido evaluada aún
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  scale: ScalePreset;
  targetMin: number; // Escenario Mínimo (aprobatorio)
  targetExpected: number; // Escenario Esperado
  targetGoal: number; // Escenario Meta
  activities: Activity[];
}

// Plantillas de evaluación habituales en universidades y colegios
const EVALUATION_PRESETS = [
  {
    name: '3 Cortes Tradicionales (30% - 30% - 40%)',
    activities: [
      { name: 'Corte 1 (Parcial + Talleres)', weight: 30 },
      { name: 'Corte 2 (Parcial + Talleres)', weight: 30 },
      { name: 'Corte 3 (Examen Final)', weight: 40 },
    ],
  },
  {
    name: '4 Parciales Equitativos (25% cada uno)',
    activities: [
      { name: 'Primer Parcial', weight: 25 },
      { name: 'Segundo Parcial', weight: 25 },
      { name: 'Tercer Parcial', weight: 25 },
      { name: 'Examen Final', weight: 25 },
    ],
  },
  {
    name: '2 Parciales (35% y 35%) + Talleres (30%)',
    activities: [
      { name: 'Primer Parcial', weight: 35 },
      { name: 'Segundo Parcial', weight: 35 },
      { name: 'Talleres, Tareas y Quices', weight: 30 },
    ],
  },
  {
    name: 'Talleres (20%) + 2 Parciales (25% c/u) + Examen Final (30%)',
    activities: [
      { name: 'Trabajos y Quices', weight: 20 },
      { name: 'Parcial 1', weight: 25 },
      { name: 'Parcial 2', weight: 25 },
      { name: 'Examen Final Acumulativo', weight: 30 },
    ],
  },
];

// Materias de ejemplo iniciales
const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-1',
    name: 'Cálculo Diferencial',
    code: 'MAT-101',
    scale: SCALE_PRESETS[0], // 0-5.0
    targetMin: 3.0,
    targetExpected: 3.8,
    targetGoal: 4.5,
    activities: [
      { id: 'act-1', name: 'Primer Parcial (Límites y Continuidad)', weight: 25, score: 3.2 },
      { id: 'act-2', name: 'Segundo Parcial (Derivadas)', weight: 25, score: 2.7 },
      { id: 'act-3', name: 'Talleres y Quices Prácticos', weight: 20, score: 4.2 },
      { id: 'act-4', name: 'Examen Final Acumulativo', weight: 30, score: null },
    ],
  },
  {
    id: 'sub-2',
    name: 'Física Mecánica',
    code: 'FIS-102',
    scale: SCALE_PRESETS[0], // 0-5.0
    targetMin: 3.0,
    targetExpected: 4.0,
    targetGoal: 4.8,
    activities: [
      { id: 'act-21', name: 'Corte 1: Cinemática', weight: 30, score: 4.0 },
      { id: 'act-22', name: 'Corte 2: Dinámica y Trabajo', weight: 35, score: 3.7 },
      { id: 'act-23', name: 'Corte 3: Proyecto y Evaluación Final', weight: 35, score: null },
    ],
  },
  {
    id: 'sub-3',
    name: 'Programación Web',
    code: 'INF-204',
    scale: SCALE_PRESETS[3], // 0-100
    targetMin: 60,
    targetExpected: 80,
    targetGoal: 95,
    activities: [
      { id: 'act-31', name: 'Entrega 1: HTML y CSS Frontend', weight: 25, score: 88 },
      { id: 'act-32', name: 'Entrega 2: JavaScript y React', weight: 35, score: 92 },
      { id: 'act-33', name: 'Laboratorios Semanales', weight: 15, score: 95 },
      { id: 'act-34', name: 'Proyecto Final & Sustentación', weight: 25, score: null },
    ],
  },
];

// Helper para formatear notas según decimales de la escala
function formatScore(score: number, decimals: number = 2): string {
  if (isNaN(score)) return '-';
  return score.toFixed(decimals);
}

export default function App() {
  // Estado de materias con persistencia en localStorage
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem('cuanto_necesito_materias_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignorar error de parsing
    }
    return INITIAL_SUBJECTS;
  });

  const [activeSubjectId, setActiveSubjectId] = useState<string>(() => {
    return subjects[0]?.id || 'sub-1';
  });

  // Modales
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const [showStandaloneModal, setShowStandaloneModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const [editingForm, setEditingForm] = useState<{
    name: string;
    code: string;
    scaleId: string;
    targetMin: number;
    targetExpected: number;
    targetGoal: number;
  }>({
    name: '',
    code: '',
    scaleId: 'scale-0-5',
    targetMin: 3.0,
    targetExpected: 3.8,
    targetGoal: 4.5,
  });

  // Simulador interactivo What-If (slider de nota tentativa para el final)
  const [whatIfScore, setWhatIfScore] = useState<number | null>(null);

  // Toggle de visualización de fórmula paso a paso
  const [showFormulaBreakdown, setShowFormulaBreakdown] = useState(false);

  // Notificaciones de copia al portapapeles
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [copiedCodeNotification, setCopiedCodeNotification] = useState(false);

  // Persistir en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cuanto_necesito_materias_v2', JSON.stringify(subjects));
    } catch {
      // Manejo seguro
    }
  }, [subjects]);

  // Materia Activa seleccionada
  const activeSubject = useMemo(() => {
    return subjects.find((s) => s.id === activeSubjectId) || subjects[0] || null;
  }, [subjects, activeSubjectId]);

  // Actualizar whatIfScore inicial cuando cambie de materia
  useEffect(() => {
    if (activeSubject) {
      setWhatIfScore(activeSubject.targetMin);
    }
  }, [activeSubjectId, activeSubject?.targetMin]);

  // ==========================================
  // Cálculos Matemáticos de la Materia Activa
  // ==========================================
  const mathCalculations = useMemo(() => {
    if (!activeSubject) return null;

    const { activities, scale, targetMin, targetExpected, targetGoal } = activeSubject;

    // Suma total de pesos asignados
    const totalWeightAssigned = activities.reduce((acc, curr) => acc + (Number(curr.weight) || 0), 0);

    // Actividades completadas (con nota válida ingresada)
    const completedActivities = activities.filter(
      (a) => a.score !== null && a.score !== undefined && !isNaN(Number(a.score))
    );

    // Actividades pendientes (sin nota)
    const pendingActivities = activities.filter(
      (a) => a.score === null || a.score === undefined || isNaN(Number(a.score))
    );

    // Peso evaluado hasta ahora
    const evaluatedWeight = completedActivities.reduce((acc, curr) => acc + (Number(curr.weight) || 0), 0);

    // Nota ponderada acumulada hasta la fecha
    // NotaAcumulada = Suma(Nota_i * Peso_i / 100)
    const accumulatedScore = completedActivities.reduce((acc, curr) => {
      const score = Number(curr.score) || 0;
      const weight = Number(curr.weight) || 0;
      return acc + (score * weight) / 100;
    }, 0);

    // Promedio parcial del estudiante (sobre el porcentaje calificado hasta ahora)
    const currentAverage = evaluatedWeight > 0 ? (accumulatedScore / evaluatedWeight) * 100 : 0;

    // Peso restante por evaluar (porcentaje pendiente)
    const pendingWeight = Math.max(0, 100 - evaluatedWeight);

    // Nota máxima posible que el estudiante puede alcanzar si saca nota perfecta en el resto
    const maxAchievableScore = accumulatedScore + (scale.max * pendingWeight) / 100;

    // Función que calcula la nota necesaria en el peso restante para alcanzar un objetivo
    // Objetivo = NotaAcumulada + (NotaNecesaria * PesoRestante / 100)
    // => NotaNecesaria = (Objetivo - NotaAcumulada) / (PesoRestante / 100)
    const calculateRequired = (target: number) => {
      if (pendingWeight <= 0) {
        return {
          target,
          requiredScore: 0,
          status: accumulatedScore >= target ? 'achieved' : 'impossible',
          diffFromGoal: accumulatedScore - target,
          alreadyFinished: true,
        };
      }

      const pointsNeeded = target - accumulatedScore;
      const requiredScore = pointsNeeded / (pendingWeight / 100);

      let status: 'already_passed' | 'achievable' | 'impossible' = 'achievable';

      if (requiredScore <= scale.min) {
        status = 'already_passed'; // Con la mínima nota ya aprueba/logra el escenario
      } else if (requiredScore > scale.max) {
        status = 'impossible'; // Requeriría más del máximo posible
      } else {
        status = 'achievable';
      }

      return {
        target,
        pointsNeeded,
        requiredScore,
        status,
        alreadyFinished: false,
      };
    };

    const minScenario = calculateRequired(targetMin);
    const expectedScenario = calculateRequired(targetExpected);
    const goalScenario = calculateRequired(targetGoal);

    // Simulación What-If interactiva
    const currentSimulatedScore = whatIfScore !== null ? whatIfScore : targetMin;
    const whatIfFinalGrade = accumulatedScore + (currentSimulatedScore * pendingWeight) / 100;
    const whatIfPassed = whatIfFinalGrade >= targetMin;

    return {
      totalWeightAssigned,
      evaluatedWeight,
      pendingWeight,
      accumulatedScore,
      currentAverage,
      maxAchievableScore,
      completedActivities,
      pendingActivities,
      minScenario,
      expectedScenario,
      goalScenario,
      whatIfFinalGrade,
      whatIfPassed,
      currentSimulatedScore,
    };
  }, [activeSubject, whatIfScore]);

  // Resumen global de todas las materias
  const globalSummary = useMemo(() => {
    let totalAccum = 0;
    let counted = 0;
    let passingCount = 0;
    let pendingFinalCount = 0;

    subjects.forEach((sub) => {
      const completed = sub.activities.filter(
        (a) => a.score !== null && a.score !== undefined && !isNaN(Number(a.score))
      );
      const evalWeight = completed.reduce((acc, curr) => acc + (Number(curr.weight) || 0), 0);
      const accum = completed.reduce(
        (acc, curr) => acc + ((Number(curr.score) || 0) * (Number(curr.weight) || 0)) / 100,
        0
      );

      if (evalWeight > 0) {
        const normalized = ((accum / evalWeight) * 100) / sub.scale.max;
        totalAccum += normalized;
        counted++;
      }

      const pendingW = Math.max(0, 100 - evalWeight);
      if (pendingW > 0) {
        pendingFinalCount++;
        const reqMin = (sub.targetMin - accum) / (pendingW / 100);
        if (reqMin <= sub.scale.min) {
          passingCount++;
        }
      } else if (accum >= sub.targetMin) {
        passingCount++;
      }
    });

    return {
      totalSubjects: subjects.length,
      averagePercentage: counted > 0 ? (totalAccum / counted) * 100 : 0,
      passingCount,
      pendingFinalCount,
    };
  }, [subjects]);

  // ==========================================
  // Handlers para Actividades
  // ==========================================
  const handleUpdateActivity = (
    activityId: string,
    field: 'name' | 'weight' | 'score',
    value: string | number | null
  ) => {
    if (!activeSubject) return;

    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== activeSubject.id) return sub;

        const updatedActivities = sub.activities.map((act) => {
          if (act.id !== activityId) return act;

          if (field === 'name') {
            return { ...act, name: String(value) };
          }

          if (field === 'weight') {
            const num = value === '' ? 0 : Number(value);
            return { ...act, weight: isNaN(num) ? 0 : Math.max(0, Math.min(100, num)) };
          }

          if (field === 'score') {
            if (value === null || value === '') {
              return { ...act, score: null };
            }
            const num = Number(value);
            return {
              ...act,
              score: isNaN(num) ? null : Math.max(sub.scale.min, Math.min(sub.scale.max, num)),
            };
          }

          return act;
        });

        return { ...sub, activities: updatedActivities };
      })
    );
  };

  const handleAddActivity = () => {
    if (!activeSubject) return;

    const remainingWeight = Math.max(
      0,
      100 - activeSubject.activities.reduce((acc, curr) => acc + (Number(curr.weight) || 0), 0)
    );

    const newActivity: Activity = {
      id: 'act-' + Date.now(),
      name: `Actividad ${activeSubject.activities.length + 1}`,
      weight: remainingWeight > 0 ? remainingWeight : 10,
      score: null,
    };

    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== activeSubject.id) return sub;
        return { ...sub, activities: [...sub.activities, newActivity] };
      })
    );
  };

  const handleDeleteActivity = (activityId: string) => {
    if (!activeSubject) return;
    if (activeSubject.activities.length <= 1) {
      alert('La materia debe tener al menos una actividad evaluativa.');
      return;
    }

    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== activeSubject.id) return sub;
        return {
          ...sub,
          activities: sub.activities.filter((a) => a.id !== activityId),
        };
      })
    );
  };

  const handleBalanceRemainingWeight = () => {
    if (!activeSubject || !mathCalculations) return;
    const missingWeight = 100 - mathCalculations.totalWeightAssigned;
    if (missingWeight <= 0) return;

    const pendingAct = activeSubject.activities.find((a) => a.score === null);
    if (pendingAct) {
      handleUpdateActivity(pendingAct.id, 'weight', pendingAct.weight + missingWeight);
    } else {
      const finalAct: Activity = {
        id: 'act-' + Date.now(),
        name: 'Examen Final / Última Evaluación',
        weight: missingWeight,
        score: null,
      };
      setSubjects((prev) =>
        prev.map((sub) => {
          if (sub.id !== activeSubject.id) return sub;
          return { ...sub, activities: [...sub.activities, finalAct] };
        })
      );
    }
  };

  // Aplicar plantilla de cortes
  const handleApplyPresetTemplate = (preset: (typeof EVALUATION_PRESETS)[0]) => {
    if (!activeSubject) return;
    const confirmed = window.confirm(
      `¿Deseas reemplazar la estructura de actividades por "${preset.name}"? Se reiniciarán las actividades de esta materia.`
    );
    if (!confirmed) return;

    const newActivities: Activity[] = preset.activities.map((item, idx) => ({
      id: `act-p-${Date.now()}-${idx}`,
      name: item.name,
      weight: item.weight,
      score: null,
    }));

    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== activeSubject.id) return sub;
        return { ...sub, activities: newActivities };
      })
    );
    setShowTemplateModal(false);
  };

  // Ajuste rápido de metas de escenarios directamente en las tarjetas
  const handleQuickAdjustTarget = (
    field: 'targetMin' | 'targetExpected' | 'targetGoal',
    delta: number
  ) => {
    if (!activeSubject) return;
    const scale = activeSubject.scale;
    const currentVal = activeSubject[field];
    const newVal = Math.max(scale.min, Math.min(scale.max, Number((currentVal + delta).toFixed(1))));

    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== activeSubject.id) return sub;
        return { ...sub, [field]: newVal };
      })
    );
  };

  // ==========================================
  // Handlers para Materias
  // ==========================================
  const handleOpenEditSubject = () => {
    if (!activeSubject) return;
    setEditingForm({
      name: activeSubject.name,
      code: activeSubject.code || '',
      scaleId: activeSubject.scale.id,
      targetMin: activeSubject.targetMin,
      targetExpected: activeSubject.targetExpected,
      targetGoal: activeSubject.targetGoal,
    });
    setIsEditingSubject(true);
  };

  const handleSaveEditSubject = () => {
    if (!activeSubject) return;
    const selectedScale = SCALE_PRESETS.find((p) => p.id === editingForm.scaleId) || activeSubject.scale;

    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== activeSubject.id) return sub;
        return {
          ...sub,
          name: editingForm.name.trim() || 'Materia sin nombre',
          code: editingForm.code.trim(),
          scale: selectedScale,
          targetMin: Number(editingForm.targetMin) || selectedScale.defaultPass,
          targetExpected: Number(editingForm.targetExpected) || selectedScale.defaultExpected,
          targetGoal: Number(editingForm.targetGoal) || selectedScale.defaultGoal,
        };
      })
    );

    setIsEditingSubject(false);
  };

  const handleOpenCreateSubject = () => {
    const defaultScale = SCALE_PRESETS[0];
    setEditingForm({
      name: '',
      code: '',
      scaleId: defaultScale.id,
      targetMin: defaultScale.defaultPass,
      targetExpected: defaultScale.defaultExpected,
      targetGoal: defaultScale.defaultGoal,
    });
    setIsCreatingSubject(true);
  };

  const handleSaveCreateSubject = () => {
    const selectedScale = SCALE_PRESETS.find((p) => p.id === editingForm.scaleId) || SCALE_PRESETS[0];
    const newId = 'sub-' + Date.now();

    const newSub: Subject = {
      id: newId,
      name: editingForm.name.trim() || 'Nueva Materia',
      code: editingForm.code.trim() || `ASIG-${subjects.length + 1}`,
      scale: selectedScale,
      targetMin: Number(editingForm.targetMin) || selectedScale.defaultPass,
      targetExpected: Number(editingForm.targetExpected) || selectedScale.defaultExpected,
      targetGoal: Number(editingForm.targetGoal) || selectedScale.defaultGoal,
      activities: [
        { id: 'act-1-' + Date.now(), name: 'Primer Parcial', weight: 30, score: null },
        { id: 'act-2-' + Date.now(), name: 'Segundo Parcial / Talleres', weight: 35, score: null },
        { id: 'act-3-' + Date.now(), name: 'Examen Final', weight: 35, score: null },
      ],
    };

    setSubjects((prev) => [...prev, newSub]);
    setActiveSubjectId(newId);
    setIsCreatingSubject(false);
  };

  const handleDeleteSubject = (idToDelete: string) => {
    if (subjects.length <= 1) {
      alert('Debes mantener al menos una materia registrada.');
      return;
    }

    if (window.confirm('¿Seguro que deseas eliminar esta materia y todas sus notas?')) {
      const remaining = subjects.filter((s) => s.id !== idToDelete);
      setSubjects(remaining);
      if (activeSubjectId === idToDelete) {
        setActiveSubjectId(remaining[0].id);
      }
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('¿Deseas restaurar las materias de ejemplo iniciales?')) {
      setSubjects(INITIAL_SUBJECTS);
      setActiveSubjectId(INITIAL_SUBJECTS[0].id);
    }
  };

  // Copiar resumen de la materia para compartir en WhatsApp o apuntes
  const handleCopySummary = () => {
    if (!activeSubject || !mathCalculations) return;

    const { scale } = activeSubject;
    const { accumulatedScore, evaluatedWeight, pendingWeight, minScenario, expectedScenario, goalScenario } =
      mathCalculations;

    const lines = [
      `📚 CUÁNTO NECESITO — ${activeSubject.name} (${activeSubject.code || ''})`,
      `Escala: ${scale.name} (Aprobatorio: ${activeSubject.targetMin})`,
      `---------------------------------`,
      `• Evaluado hasta hoy: ${evaluatedWeight}% con nota acumulada de ${formatScore(accumulatedScore, scale.decimals)}`,
      `• Falta por evaluar: ${pendingWeight}%`,
      ``,
      `🎯 SIMULADOR DE ESCENARIOS:`,
      `1️⃣ Escenario Mínimo (Pasar con ${activeSubject.targetMin}):`,
      minScenario.status === 'already_passed'
        ? `   ¡YA APROBADA! 🎉 Incluso con ${scale.min} apruebas.`
        : minScenario.status === 'impossible'
        ? `   ⚠️ Imposible matemáticamente (máx alcanzable: ${formatScore(mathCalculations.maxAchievableScore, scale.decimals)})`
        : `   👉 Necesitas sacar: ${formatScore(minScenario.requiredScore, scale.decimals)} en el ${pendingWeight}% restante`,
      ``,
      `2️⃣ Escenario Esperado (Nota ${activeSubject.targetExpected}):`,
      expectedScenario.status === 'already_passed'
        ? `   ¡Ya asegurado! 🎉`
        : expectedScenario.status === 'impossible'
        ? `   ⚠️ Fuera de rango posible`
        : `   👉 Necesitas sacar: ${formatScore(expectedScenario.requiredScore, scale.decimals)}`,
      ``,
      `3️⃣ Escenario Meta (Nota ${activeSubject.targetGoal}):`,
      goalScenario.status === 'already_passed'
        ? `   ¡Superado! 🏆`
        : goalScenario.status === 'impossible'
        ? `   ⚠️ Fuera de rango posible`
        : `   👉 Necesitas sacar: ${formatScore(goalScenario.requiredScore, scale.decimals)}`,
      `---------------------------------`,
      `Calculado con la app "CUÁNTO NECESITO"`,
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Generador de código Standalone de un solo archivo HTML
  const standaloneHtmlCode = useMemo(() => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CUÁNTO NECESITO - Calculadora de Notas</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen">
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useMemo, useEffect } = React;

    const SCALES = [
      { id: 'scale-0-5', name: 'Escala 0 a 5.0 (Colombia)', min: 0, max: 5.0, step: 0.1, decimals: 2, defaultPass: 3.0, defaultExpected: 3.8, defaultGoal: 4.5 },
      { id: 'scale-0-10', name: 'Escala 0 a 10 (México, España)', min: 0, max: 10.0, step: 0.1, decimals: 1, defaultPass: 6.0, defaultExpected: 8.0, defaultGoal: 9.5 },
      { id: 'scale-0-20', name: 'Escala 0 a 20 (Perú, Venezuela)', min: 0, max: 20.0, step: 0.5, decimals: 1, defaultPass: 10.5, defaultExpected: 14.0, defaultGoal: 18.0 },
      { id: 'scale-0-100', name: 'Escala 0 a 100 (Bolivia, EE.UU.)', min: 0, max: 100, step: 1, decimals: 0, defaultPass: 60, defaultExpected: 80, defaultGoal: 92 },
      { id: 'scale-1-7', name: 'Escala 1.0 a 7.0 (Chile)', min: 1.0, max: 7.0, step: 0.1, decimals: 1, defaultPass: 4.0, defaultExpected: 5.5, defaultGoal: 6.5 }
    ];

    function App() {
      const [scale, setScale] = useState(SCALES[0]);
      const [targetMin, setTargetMin] = useState(3.0);
      const [targetExpected, setTargetExpected] = useState(3.8);
      const [targetGoal, setTargetGoal] = useState(4.5);
      const [whatIf, setWhatIf] = useState(3.0);

      const [activities, setActivities] = useState([
        { id: 1, name: 'Primer Parcial', weight: 25, score: 3.2 },
        { id: 2, name: 'Segundo Parcial', weight: 25, score: 2.8 },
        { id: 3, name: 'Talleres y Quices', weight: 20, score: 4.0 },
        { id: 4, name: 'Examen Final', weight: 30, score: null }
      ]);

      const totalWeight = activities.reduce((acc, a) => acc + (Number(a.weight) || 0), 0);
      const completed = activities.filter(a => a.score !== null && !isNaN(Number(a.score)));
      const evaluatedWeight = completed.reduce((acc, a) => acc + (Number(a.weight) || 0), 0);
      const accum = completed.reduce((acc, a) => acc + (Number(a.score) * Number(a.weight)) / 100, 0);
      const pendingWeight = Math.max(0, 100 - evaluatedWeight);

      const calculateRequired = (target) => {
        if (pendingWeight <= 0) return { val: 0, status: accum >= target ? 'passed' : 'failed' };
        const req = (target - accum) / (pendingWeight / 100);
        if (req <= scale.min) return { val: req, status: 'already_passed' };
        if (req > scale.max) return { val: req, status: 'impossible' };
        return { val: req, status: 'achievable' };
      };

      const minReq = calculateRequired(targetMin);
      const expReq = calculateRequired(targetExpected);
      const goalReq = calculateRequired(targetGoal);

      const simulatedFinal = accum + (Number(whatIf) * pendingWeight) / 100;

      return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
          <header className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">CUÁNTO NECESITO</h1>
              <p className="text-xs text-slate-500">Calculadora de nota final y simulador de 3 escenarios</p>
            </div>
            <select
              value={scale.id}
              onChange={(e) => {
                const s = SCALES.find(x => x.id === e.target.value);
                setScale(s);
                setTargetMin(s.defaultPass);
                setTargetExpected(s.defaultExpected);
                setTargetGoal(s.defaultGoal);
                setWhatIf(s.defaultPass);
              }}
              className="text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 font-medium"
            >
              {SCALES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </header>

          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">Cálculo en Tiempo Real</span>
            <h2 className="text-lg font-bold mt-1">Para aprobar con {targetMin.toFixed(scale.decimals)} necesitas sacar:</h2>
            <div className="my-3">
              {minReq.status === 'already_passed' ? (
                <div className="text-3xl font-black text-emerald-400">¡Ya aprobaste! 🎉</div>
              ) : minReq.status === 'impossible' ? (
                <div className="text-3xl font-black text-rose-400">Inalcanzable ⚠️</div>
              ) : (
                <div className="text-5xl font-black font-mono">{minReq.val.toFixed(scale.decimals)} <span className="text-lg text-indigo-200">/ {scale.max}</span></div>
              )}
            </div>
            <p className="text-xs text-slate-400">en el {pendingWeight}% restante de la materia</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-amber-600 uppercase">1. Escenario Mínimo</span>
              <p className="text-xs text-slate-500">Meta: {targetMin}</p>
              <div className="text-2xl font-bold font-mono mt-2">
                {minReq.status === 'already_passed' ? 'Asegurado' : minReq.status === 'impossible' ? 'Imposible' : minReq.val.toFixed(scale.decimals)}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 shadow-sm">
              <span className="text-xs font-bold text-indigo-600 uppercase">2. Escenario Esperado</span>
              <p className="text-xs text-slate-500">Meta: {targetExpected}</p>
              <div className="text-2xl font-bold font-mono mt-2">
                {expReq.status === 'already_passed' ? 'Asegurado' : expReq.status === 'impossible' ? 'Imposible' : expReq.val.toFixed(scale.decimals)}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 shadow-sm">
              <span className="text-xs font-bold text-emerald-600 uppercase">3. Escenario Meta</span>
              <p className="text-xs text-slate-500">Meta: {targetGoal}</p>
              <div className="text-2xl font-bold font-mono mt-2">
                {goalReq.status === 'already_passed' ? 'Superado' : goalReq.status === 'impossible' ? 'Imposible' : goalReq.val.toFixed(scale.decimals)}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-2">Simulador &ldquo;¿Qué pasa si me saco...?&rdquo;</h3>
            <div className="flex items-center justify-between text-xs mb-2">
              <span>Nota tentativa en examen final ({pendingWeight}%):</span>
              <strong className="font-mono text-indigo-600 text-sm">{Number(whatIf).toFixed(scale.decimals)}</strong>
            </div>
            <input
              type="range"
              min={scale.min}
              max={scale.max}
              step={scale.step}
              value={whatIf}
              onChange={e => setWhatIf(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-4 p-4 rounded-xl bg-slate-100 flex justify-between items-center">
              <span>Tu Nota Definitiva Final sería:</span>
              <span className="text-2xl font-black font-mono text-slate-900">{simulatedFinal.toFixed(scale.decimals)}</span>
            </div>
          </div>
        </div>
      );
    }

    ReactDOM.render(<App />, document.getElementById('root'));
  </script>
</body>
</html>`;
  }, []);

  const handleDownloadStandaloneHtml = () => {
    const blob = new Blob([standaloneHtmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cuanto-necesito.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyStandaloneCode = () => {
    navigator.clipboard.writeText(standaloneHtmlCode);
    setCopiedCodeNotification(true);
    setTimeout(() => setCopiedCodeNotification(false), 2500);
  };

  if (!activeSubject || !mathCalculations) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center max-w-md">
          <GraduationCap className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">No hay materias configuradas</h2>
          <p className="text-slate-500 text-sm mt-2 mb-6">Comienza creando tu primera materia para calcular tus notas.</p>
          <button
            onClick={handleResetToDefaults}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Cargar materias de prueba
          </button>
        </div>
      </div>
    );
  }

  const { scale } = activeSubject;
  const {
    totalWeightAssigned,
    evaluatedWeight,
    pendingWeight,
    accumulatedScore,
    currentAverage,
    maxAchievableScore,
    minScenario,
    expectedScenario,
    goalScenario,
    whatIfFinalGrade,
    whatIfPassed,
    currentSimulatedScore,
  } = mathCalculations;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* ==========================================
          NAVBAR SUPERIOR & BRANDING
      ========================================== */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">CUÁNTO NECESITO</span>
                <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Calculadora Estudiantil
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Calcula la nota exacta para aprobar tu materia y simula escenarios
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStandaloneModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              title="Ver / Descargar código en un solo archivo HTML para uso local"
            >
              <FileCode className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">Archivo Único</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              title="Copiar resumen al portapapeles"
            >
              {copiedNotification ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedNotification ? '¡Copiado!' : 'Compartir'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              title="Imprimir o guardar como PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden md:inline">Imprimir</span>
            </button>

            <button
              onClick={handleOpenCreateSubject}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Materia</span>
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================
          BARRA DE MATERIAS / PESTAÑAS
      ========================================== */}
      <section className="bg-slate-100 border-b border-slate-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {subjects.map((sub) => {
              const isActive = sub.id === activeSubject.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubjectId(sub.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition flex items-center gap-2 border ${
                    isActive
                      ? 'bg-white text-indigo-700 border-indigo-200 shadow-xs font-semibold'
                      : 'bg-transparent text-slate-600 border-transparent hover:bg-white/60 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{sub.name}</span>
                  {sub.code && (
                    <span className="text-[10px] text-slate-400 font-mono">({sub.code})</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs text-slate-500 min-w-max pl-4 border-l border-slate-200">
            <span>
              Materias: <strong className="text-slate-800">{globalSummary.totalSubjects}</strong>
            </span>
            <span>·</span>
            <span>
              Aprobadas / Seguras:{' '}
              <strong className="text-emerald-700 font-semibold">{globalSummary.passingCount}</strong>
            </span>
            <span>·</span>
            <span>
              En juego:{' '}
              <strong className="text-indigo-700 font-semibold">{globalSummary.pendingFinalCount}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* ==========================================
          CONTENIDO PRINCIPAL: 2 COLUMNAS
      ========================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Banner de Cabecera de la Materia Activa */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {activeSubject.name}
              </h1>
              {activeSubject.code && (
                <span className="font-mono text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {activeSubject.code}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <span>{scale.name}</span>
              <span aria-hidden="true">·</span>
              <span>Rango: {scale.min} a {scale.max}</span>
              <span aria-hidden="true">·</span>
              <span>
                Mínimo Aprobatorio:{' '}
                <strong className="text-slate-800">{formatScore(activeSubject.targetMin, scale.decimals)}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Esperado: <strong className="text-slate-800">{formatScore(activeSubject.targetExpected, scale.decimals)}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Meta: <strong className="text-slate-800">{formatScore(activeSubject.targetGoal, scale.decimals)}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center print:hidden">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
              title="Cargar estructura típica de evaluaciones"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Plantillas de Cortes</span>
            </button>

            <button
              onClick={handleOpenEditSubject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Configurar</span>
            </button>

            <button
              onClick={() => handleDeleteSubject(activeSubject.id)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
              title="Eliminar materia"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Alerta si las ponderaciones no suman 100% */}
        {totalWeightAssigned !== 100 && (
          <div
            className={`rounded-xl p-4 mb-6 border flex items-start justify-between gap-3 ${
              totalWeightAssigned < 100
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
              <div className="text-xs">
                <p className="font-semibold text-sm">
                  {totalWeightAssigned < 100
                    ? `Ponderación incompleta: ${totalWeightAssigned}% asignado (Falta ${100 - totalWeightAssigned}%)`
                    : `Ponderación excedida: ${totalWeightAssigned}% asignado (Excede en ${totalWeightAssigned - 100}%)`}
                </p>
                <p className="text-slate-600 mt-0.5">
                  Para que el cálculo de la nota final sea 100% exacto, la suma de los porcentajes de todas las evaluaciones debe ser igual al 100%.
                </p>
              </div>
            </div>

            {totalWeightAssigned < 100 && (
              <button
                onClick={handleBalanceRemainingWeight}
                className="shrink-0 px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-xs transition"
              >
                Asignar {100 - totalWeightAssigned}% restante a evaluación final
              </button>
            )}
          </div>
        )}

        {/* Layout en 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* =========================================================
              COLUMNA IZQUIERDA: LISTA Y REGISTRO DE ACTIVIDADES (7 COLS)
          ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Actividades y Evaluaciones
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Registra cada evaluación con su porcentaje (%) y la nota que obtuviste.
                  </p>
                </div>

                <button
                  onClick={handleAddActivity}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition print:hidden"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Evaluación</span>
                </button>
              </div>

              {/* Barra de progreso de ponderación evaluada */}
              <div className="p-4 sm:p-5 bg-white border-b border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-600">
                    Progreso evaluado:{' '}
                    <strong className="text-slate-900 font-semibold">{evaluatedWeight}%</strong> de 100%
                  </span>
                  <span className="text-indigo-600 font-medium">
                    {pendingWeight > 0 ? `${pendingWeight}% pendiente por evaluar` : '100% completado'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, evaluatedWeight)}%` }}
                    title={`Evaluado: ${evaluatedWeight}%`}
                  />
                  <div
                    className="bg-indigo-300 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100 - evaluatedWeight, pendingWeight)}%` }}
                    title={`Pendiente: ${pendingWeight}%`}
                  />
                </div>
              </div>

              {/* Tabla de Actividades */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Actividad / Evaluación</th>
                      <th className="py-3 px-3 w-28 text-center">Peso (%)</th>
                      <th className="py-3 px-3 w-32 text-center">Nota ({scale.min}-{scale.max})</th>
                      <th className="py-3 px-3 w-24 text-right">Aporte</th>
                      <th className="py-3 px-3 w-12 text-center print:hidden"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {activeSubject.activities.map((activity, index) => {
                      const isGraded = activity.score !== null && !isNaN(Number(activity.score));
                      const contribution = isGraded
                        ? ((Number(activity.score) * Number(activity.weight)) / 100).toFixed(scale.decimals)
                        : null;

                      return (
                        <tr
                          key={activity.id}
                          className={`hover:bg-slate-50/60 transition ${
                            !isGraded ? 'bg-indigo-50/30' : ''
                          }`}
                        >
                          {/* Nombre de la actividad */}
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={activity.name}
                              onChange={(e) => handleUpdateActivity(activity.id, 'name', e.target.value)}
                              placeholder={`Ej: Parcial ${index + 1}`}
                              className="w-full bg-transparent border-0 border-b border-transparent focus:border-indigo-500 focus:ring-0 p-0 text-xs font-medium text-slate-800 placeholder-slate-400"
                            />
                            {!isGraded && (
                              <span className="text-[10px] text-indigo-600 font-medium inline-block mt-0.5">
                                Pendiente (por definir o última evaluación)
                              </span>
                            )}
                          </td>

                          {/* Ponderación % */}
                          <td className="py-3 px-3 text-center">
                            <div className="relative inline-flex items-center">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                step={1}
                                value={activity.weight === 0 ? '' : activity.weight}
                                onChange={(e) => handleUpdateActivity(activity.id, 'weight', e.target.value)}
                                className="w-16 text-center font-mono text-xs font-semibold py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                              />
                              <span className="ml-1 text-slate-400 font-medium text-xs">%</span>
                            </div>
                          </td>

                          {/* Nota Obtenida */}
                          <td className="py-3 px-3 text-center">
                            <div className="inline-flex items-center gap-1 justify-center">
                              <input
                                type="number"
                                min={scale.min}
                                max={scale.max}
                                step={scale.step}
                                value={activity.score === null ? '' : activity.score}
                                onChange={(e) => handleUpdateActivity(activity.id, 'score', e.target.value)}
                                placeholder="Pendiente"
                                className={`w-20 text-center font-mono text-xs font-bold py-1.5 px-2 rounded-lg border outline-none transition ${
                                  isGraded
                                    ? Number(activity.score) >= activeSubject.targetMin
                                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                                      : 'bg-rose-50/70 border-rose-300 text-rose-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                                    : 'bg-indigo-50/50 border-indigo-200 text-indigo-700 placeholder-indigo-400 focus:bg-white focus:border-indigo-500'
                                }`}
                              />
                              {isGraded && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateActivity(activity.id, 'score', null)}
                                  className="text-slate-400 hover:text-slate-600 p-0.5 rounded print:hidden"
                                  title="Marcar como pendiente"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Aporte de puntos */}
                          <td className="py-3 px-3 text-right font-mono text-xs">
                            {contribution !== null ? (
                              <span className="font-semibold text-slate-700">+{contribution}</span>
                            ) : (
                              <span className="text-slate-400 text-[11px] italic">por evaluar</span>
                            )}
                          </td>

                          {/* Eliminar */}
                          <td className="py-3 px-3 text-center print:hidden">
                            <button
                              type="button"
                              onClick={() => handleDeleteActivity(activity.id)}
                              className="text-slate-300 hover:text-rose-500 transition p-1 rounded"
                              title="Eliminar evaluación"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 font-semibold text-xs border-t border-slate-200 text-slate-800">
                      <td className="py-3 px-4">Totales</td>
                      <td className="py-3 px-3 text-center font-mono">
                        <span className={totalWeightAssigned === 100 ? 'text-emerald-700' : 'text-amber-700'}>
                          {totalWeightAssigned}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center text-slate-500 text-[11px]">
                        {evaluatedWeight}% calificado
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-indigo-700 font-bold">
                        {formatScore(accumulatedScore, scale.decimals)} pts
                      </td>
                      <td className="print:hidden"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Botón rápido para agregar actividad o balancear */}
              <div className="p-3 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between gap-2 print:hidden">
                <span className="text-[11px] text-slate-500">
                  Tip: Deja el campo de nota en blanco para marcar evaluaciones futuras o pendientes.
                </span>
                <button
                  type="button"
                  onClick={handleAddActivity}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Añadir otra evaluación</span>
                </button>
              </div>
            </div>

            {/* Tarjeta Informativa de Estado Acumulado */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Puntos Acumulados
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black font-mono text-slate-900">
                    {formatScore(accumulatedScore, scale.decimals)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ {scale.max}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Aportados por el {evaluatedWeight}% calificado
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Promedio Actual
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={`text-2xl font-black font-mono ${
                      currentAverage >= activeSubject.targetMin ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {formatScore(currentAverage, scale.decimals)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ {scale.max}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Rendimiento sobre lo evaluado
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Máximo Posible
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black font-mono text-indigo-700">
                    {formatScore(maxAchievableScore, scale.decimals)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ {scale.max}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Si sacas {scale.max} en el {pendingWeight}% restante
                </p>
              </div>
            </div>
          </div>

          {/* =========================================================
              COLUMNA DERECHA: RESULTADO EN TIEMPO REAL & SIMULADOR DE ESCENARIOS (5 COLS)
          ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            {/* ==========================================
                TARJETA PRINCIPAL: ¿CUÁNTO NECESITO PARA APROBAR?
            ========================================== */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-linear-to-br from-slate-900 to-indigo-950 text-white">
                <div className="flex items-center justify-between text-xs text-indigo-200 mb-1">
                  <span className="font-semibold uppercase tracking-wider">Cálculo en Tiempo Real</span>
                  <span>Última Evaluación ({pendingWeight}%)</span>
                </div>

                <h2 className="text-lg font-bold text-white mb-3">
                  Para aprobar con {formatScore(activeSubject.targetMin, scale.decimals)} necesitas:
                </h2>

                {/* Display Numérico Gigante de la Nota Necesaria */}
                <div className="flex items-center gap-4 my-2">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
                    <Calculator className="w-8 h-8 text-indigo-300" />
                  </div>
                  <div>
                    {minScenario.alreadyFinished ? (
                      <div>
                        <div className="text-3xl font-black font-mono tracking-tight text-white">
                          {formatScore(accumulatedScore, scale.decimals)}
                        </div>
                        <p className="text-xs text-indigo-200 mt-0.5">
                          {accumulatedScore >= activeSubject.targetMin
                            ? '🎉 ¡Materia finalizada y aprobada!'
                            : 'Materia finalizada sin alcanzar el mínimo'}
                        </p>
                      </div>
                    ) : minScenario.status === 'already_passed' ? (
                      <div>
                        <div className="text-3xl font-black tracking-tight text-emerald-400">
                          ¡Ya Aprobaste! 🎉
                        </div>
                        <p className="text-xs text-emerald-200 mt-0.5">
                          Incluso con {scale.min} en el final, tu nota supera {activeSubject.targetMin}
                        </p>
                      </div>
                    ) : minScenario.status === 'impossible' ? (
                      <div>
                        <div className="text-2xl font-black tracking-tight text-rose-300">
                          Inalcanzable ⚠️
                        </div>
                        <p className="text-xs text-rose-200 mt-0.5">
                          Tu nota final máxima sería {formatScore(maxAchievableScore, scale.decimals)}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
                            {formatScore(minScenario.requiredScore, scale.decimals)}
                          </span>
                          <span className="text-sm font-mono text-indigo-200">/ {scale.max}</span>
                        </div>
                        <p className="text-xs text-indigo-200 mt-1 font-medium">
                          en la última evaluación ({pendingWeight}% pendiente)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Resumen de puntos */}
                <div className="mt-4 pt-3 border-t border-white/10 text-xs text-indigo-200 flex items-center justify-between">
                  <span>
                    Acumulado actual: <strong>{formatScore(accumulatedScore, scale.decimals)}</strong>
                  </span>
                  <span>
                    Faltan: <strong>{formatScore(Math.max(0, activeSubject.targetMin - accumulatedScore), scale.decimals)} pts</strong>
                  </span>
                </div>
              </div>

              {/* Botón para alternar la vista detallada de la fórmula */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs print:hidden">
                <button
                  type="button"
                  onClick={() => setShowFormulaBreakdown(!showFormulaBreakdown)}
                  className="font-medium text-slate-700 hover:text-indigo-600 transition flex items-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>{showFormulaBreakdown ? 'Ocultar desglose matemático' : 'Ver cómo se calcula (fórmula paso a paso)'}</span>
                </button>
                {showFormulaBreakdown ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {/* Desglose Matemático Paso a Paso */}
              {showFormulaBreakdown && (
                <div className="p-5 border-t border-slate-100 bg-slate-50/50 text-xs space-y-3 font-mono">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700 space-y-2">
                    <p className="font-semibold text-slate-900 font-sans">Fórmula matemática:</p>
                    <p className="p-2 bg-slate-100 rounded text-indigo-900 font-mono text-[11px]">
                      Nota Requerida = (Nota Objetivo - Puntos Acumulados) ÷ (Porcentaje Pendiente ÷ 100)
                    </p>

                    <div className="space-y-1.5 pt-1 text-[11px]">
                      <p>
                        1. Puntos acumulados: <strong className="text-slate-900">{formatScore(accumulatedScore, scale.decimals)}</strong>
                      </p>
                      <p>
                        2. Porcentaje pendiente: <strong className="text-slate-900">{pendingWeight}%</strong> (es decir, {pendingWeight / 100})
                      </p>
                      <p>
                        3. Puntos faltantes para {activeSubject.targetMin}:{' '}
                        <strong className="text-slate-900">
                          {formatScore(Math.max(0, activeSubject.targetMin - accumulatedScore), scale.decimals)}
                        </strong>
                      </p>
                      <p>
                        4. Cálculo final:{' '}
                        {`(${activeSubject.targetMin} - ${formatScore(accumulatedScore, scale.decimals)}) ÷ (${pendingWeight} / 100)`} ={' '}
                        <strong className="text-indigo-600 font-bold">
                          {formatScore(minScenario.requiredScore, scale.decimals)}
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* =========================================================
                SIMULADOR DE LOS TRES ESCENARIOS (MÍNIMO, ESPERADO, META)
            ========================================================= */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Simulador de Escenarios</h3>
                  <p className="text-xs text-slate-500">
                    Compara la nota que necesitas sacar para cada uno de tus 3 objetivos
                  </p>
                </div>
                <Sliders className="w-4 h-4 text-indigo-600" />
              </div>

              {/* Las 3 Tarjetas de Escenarios */}
              <div className="space-y-3">
                {/* 1. ESCENARIO MÍNIMO (APROBATORIO) */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-300 transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                        Escenario Mínimo (Aprobar)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span>Meta:</span>
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {formatScore(activeSubject.targetMin, scale.decimals)}
                      </span>
                      <div className="inline-flex gap-0.5 print:hidden">
                        <button
                          type="button"
                          onClick={() => handleQuickAdjustTarget('targetMin', -scale.step)}
                          className="px-1 py-0.5 text-[10px] bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-600"
                          title="Disminuir meta"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjustTarget('targetMin', scale.step)}
                          className="px-1 py-0.5 text-[10px] bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-600"
                          title="Aumentar meta"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Nota necesaria en el final:</span>
                      {minScenario.status === 'already_passed' ? (
                        <span className="text-sm font-bold text-emerald-600">¡Aprobado sin riesgo!</span>
                      ) : minScenario.status === 'impossible' ? (
                        <span className="text-sm font-bold text-rose-600">Imposible (&gt; {scale.max})</span>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black font-mono text-slate-900">
                            {formatScore(minScenario.requiredScore, scale.decimals)}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">/ {scale.max}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      {minScenario.status === 'already_passed' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Seguro
                        </span>
                      ) : minScenario.status === 'impossible' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded">
                          <XCircle className="w-3.5 h-3.5" /> Crítico
                        </span>
                      ) : minScenario.requiredScore <= activeSubject.targetMin ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                          Alcanzable
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                          Exigente
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. ESCENARIO ESPERADO */}
                <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 hover:border-indigo-200 transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                      <span className="font-bold text-xs uppercase tracking-wider text-indigo-900">
                        Escenario Esperado (Buen Promedio)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-indigo-900">
                      <span>Meta:</span>
                      <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-indigo-200">
                        {formatScore(activeSubject.targetExpected, scale.decimals)}
                      </span>
                      <div className="inline-flex gap-0.5 print:hidden">
                        <button
                          type="button"
                          onClick={() => handleQuickAdjustTarget('targetExpected', -scale.step)}
                          className="px-1 py-0.5 text-[10px] bg-white hover:bg-indigo-100 border border-indigo-200 rounded text-indigo-800"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjustTarget('targetExpected', scale.step)}
                          className="px-1 py-0.5 text-[10px] bg-white hover:bg-indigo-100 border border-indigo-200 rounded text-indigo-800"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Nota necesaria en el final:</span>
                      {expectedScenario.status === 'already_passed' ? (
                        <span className="text-sm font-bold text-emerald-600">¡Alcanzado con creces!</span>
                      ) : expectedScenario.status === 'impossible' ? (
                        <span className="text-sm font-bold text-rose-600">Imposible (&gt; {scale.max})</span>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black font-mono text-indigo-900">
                            {formatScore(expectedScenario.requiredScore, scale.decimals)}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">/ {scale.max}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      {expectedScenario.status === 'already_passed' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Superado
                        </span>
                      ) : expectedScenario.status === 'impossible' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded">
                          Máx: {formatScore(maxAchievableScore, scale.decimals)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
                          Alcanzable
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. ESCENARIO META (EXCELENCIA / BECA) */}
                <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 hover:border-emerald-200 transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      <span className="font-bold text-xs uppercase tracking-wider text-emerald-900">
                        Escenario Meta (Excelencia / Beca)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-emerald-900">
                      <span>Meta:</span>
                      <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                        {formatScore(activeSubject.targetGoal, scale.decimals)}
                      </span>
                      <div className="inline-flex gap-0.5 print:hidden">
                        <button
                          type="button"
                          onClick={() => handleQuickAdjustTarget('targetGoal', -scale.step)}
                          className="px-1 py-0.5 text-[10px] bg-white hover:bg-emerald-100 border border-emerald-200 rounded text-emerald-800"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjustTarget('targetGoal', scale.step)}
                          className="px-1 py-0.5 text-[10px] bg-white hover:bg-emerald-100 border border-emerald-200 rounded text-emerald-800"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Nota necesaria en el final:</span>
                      {goalScenario.status === 'already_passed' ? (
                        <span className="text-sm font-bold text-emerald-600">¡Meta asegurada! 🏆</span>
                      ) : goalScenario.status === 'impossible' ? (
                        <span className="text-sm font-bold text-slate-500">
                          Inalcanzable (Máx: {formatScore(maxAchievableScore, scale.decimals)})
                        </span>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black font-mono text-emerald-900">
                            {formatScore(goalScenario.requiredScore, scale.decimals)}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">/ {scale.max}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      {goalScenario.status === 'already_passed' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                          🏆 Honor
                        </span>
                      ) : goalScenario.status === 'impossible' ? (
                        <span className="text-[11px] text-slate-400">Objetivo fuera de rango</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                          Alto rendimiento
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================
                SIMULADOR INTERACTIVO "QUÉ PASA SI..." (WHAT-IF SLIDER)
            ========================================================= */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 print:hidden">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Simulador &ldquo;¿Qué pasa si me saco...?&rdquo;
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mueve el control para ver cómo quedaría tu nota definitiva final
                  </p>
                </div>
              </div>

              {pendingWeight > 0 ? (
                <div className="space-y-4 pt-1">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-600 font-medium">
                        Nota tentativa en el examen final ({pendingWeight}%):
                      </span>
                      <span className="font-mono text-base font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                        {formatScore(currentSimulatedScore, scale.decimals)}
                      </span>
                    </div>

                    <input
                      type="range"
                      min={scale.min}
                      max={scale.max}
                      step={scale.step}
                      value={currentSimulatedScore}
                      onChange={(e) => setWhatIfScore(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                    />

                    <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                      <span>Mínimo: {scale.min}</span>
                      <span>Mín. aprobar: {activeSubject.targetMin}</span>
                      <span>Máximo: {scale.max}</span>
                    </div>
                  </div>

                  {/* Resultado de la simulación */}
                  <div
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      whatIfPassed
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50/70 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider block opacity-75">
                        Tu Nota Definitiva Final sería:
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-3xl font-black font-mono">
                          {formatScore(whatIfFinalGrade, scale.decimals)}
                        </span>
                        <span className="text-xs opacity-70 font-mono">/ {scale.max}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      {whatIfPassed ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white shadow-xs">
                            <Check className="w-3.5 h-3.5" /> APROBADA
                          </span>
                          <span className="block text-[11px] text-emerald-700 font-medium">
                            +{formatScore(whatIfFinalGrade - activeSubject.targetMin, scale.decimals)} sobre el mínimo
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-600 text-white shadow-xs">
                            <X className="w-3.5 h-3.5" /> REPROBADA
                          </span>
                          <span className="block text-[11px] text-rose-700 font-medium">
                            Faltan {formatScore(activeSubject.targetMin - whatIfFinalGrade, scale.decimals)} pts
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 text-center">
                  Esta materia ya tiene el 100% de sus notas ingresadas. Si deseas simular, marca alguna evaluación como pendiente borrando su nota.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ==========================================
          MODAL: PLANTILLAS DE CORTES
      ========================================== */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Estructuras de Evaluación Comunes
              </h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Selecciona una plantilla para configurar automáticamente los porcentajes de tu materia:
            </p>

            <div className="space-y-2.5">
              {EVALUATION_PRESETS.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handleApplyPresetTemplate(preset)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition group"
                >
                  <span className="font-semibold text-xs text-slate-900 group-hover:text-indigo-900 block">
                    {preset.name}
                  </span>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    {preset.activities.map((act, actIdx) => (
                      <span
                        key={actIdx}
                        className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono"
                      >
                        {act.name}: {act.weight}%
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: CREAR / CONFIGURAR MATERIA
      ========================================== */}
      {(isEditingSubject || isCreatingSubject) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {isCreatingSubject ? 'Nueva Materia' : 'Configurar Materia'}
              </h3>
              <button
                onClick={() => {
                  setIsEditingSubject(false);
                  setIsCreatingSubject(false);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Nombre de la Materia */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre de la Asignatura</label>
                <input
                  type="text"
                  placeholder="Ej: Álgebra Lineal, Química Orgánica..."
                  value={editingForm.name}
                  onChange={(e) => setEditingForm({ ...editingForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Código */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Código de Materia (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: MAT-201"
                  value={editingForm.code}
                  onChange={(e) => setEditingForm({ ...editingForm, code: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Selector de Escala de Calificación */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Escala de Calificación</label>
                <select
                  value={editingForm.scaleId}
                  onChange={(e) => {
                    const preset = SCALE_PRESETS.find((p) => p.id === e.target.value);
                    if (preset) {
                      setEditingForm({
                        ...editingForm,
                        scaleId: preset.id,
                        targetMin: preset.defaultPass,
                        targetExpected: preset.defaultExpected,
                        targetGoal: preset.defaultGoal,
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  {SCALE_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.country}) — Rango {p.min} a {p.max}
                    </option>
                  ))}
                </select>
              </div>

              {/* Configuración de los 3 Escenarios */}
              <div className="pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-800 block mb-2">
                  Metas para los 3 Escenarios:
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Mínimo (Aprobar)</label>
                    <input
                      type="number"
                      step="any"
                      value={editingForm.targetMin}
                      onChange={(e) => setEditingForm({ ...editingForm, targetMin: Number(e.target.value) })}
                      className="w-full font-mono text-center font-bold px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Esperado</label>
                    <input
                      type="number"
                      step="any"
                      value={editingForm.targetExpected}
                      onChange={(e) => setEditingForm({ ...editingForm, targetExpected: Number(e.target.value) })}
                      className="w-full font-mono text-center font-bold px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-indigo-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Meta (Excelencia)</label>
                    <input
                      type="number"
                      step="any"
                      value={editingForm.targetGoal}
                      onChange={(e) => setEditingForm({ ...editingForm, targetGoal: Number(e.target.value) })}
                      className="w-full font-mono text-center font-bold px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-emerald-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditingSubject(false);
                  setIsCreatingSubject(false);
                }}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={isCreatingSubject ? handleSaveCreateSubject : handleSaveEditSubject}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
              >
                {isCreatingSubject ? 'Crear Materia' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: CÓDIGO EN UN SOLO ARCHIVO HTML
      ========================================== */}
      {showStandaloneModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Código en 1 Solo Archivo (HTML + CSS + JS)
                </h3>
              </div>
              <button
                onClick={() => setShowStandaloneModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Este archivo contiene todo el HTML, Tailwind CSS y JavaScript necesario de forma completamente autónoma.
              Puedes descargarlo y abrirlo directamente en cualquier navegador o compartirlo sin necesidad de configurar ningún servidor.
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadStandaloneHtml}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Descargar archivo cuanto-necesito.html</span>
              </button>

              <button
                onClick={handleCopyStandaloneCode}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
              >
                {copiedCodeNotification ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCodeNotification ? '¡Código Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] border border-slate-800">
              <pre className="whitespace-pre-wrap">{standaloneHtmlCode}</pre>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowStandaloneModal(false)}
                className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          FOOTER SENCILLO & ACCESOS RÁPIDOS
      ========================================== */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">CUÁNTO NECESITO</span>
            <span>·</span>
            <span>Tus datos se guardan automáticamente en tu navegador</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowStandaloneModal(true)}
              className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Ver código HTML único</span>
            </button>

            <button
              onClick={handleResetToDefaults}
              className="text-slate-400 hover:text-slate-600 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar materias de ejemplo</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
