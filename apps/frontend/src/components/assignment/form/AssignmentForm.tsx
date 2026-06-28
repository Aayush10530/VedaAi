import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { FormProgressBar } from './FormProgressBar';
import { StepDetails } from './StepDetails';
import { StepQuestions } from './StepQuestions';
import { AiToolkitPanel } from '../../ui/AiToolkitPanel';
import { assignmentService } from '../../../services/assignmentService';
import { useUiStore } from '../../../store/uiStore';
import { useWsStore } from '../../../store/wsStore';

export function AssignmentForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const { showToast, setLoading } = useUiStore();
  const { setActiveJobId, setJobStatus } = useWsStore();

  const methods = useForm({
    defaultValues: {
      title: '',
      subject: '',
      grade: '',
      schoolName: '',
      dueDate: '',
      timeLimit: 45,
      fileUrl: '',
      filename: '',
      questionConfig: [
        { type: 'mcq', count: 5, marksEach: 2 },
      ],
      additionalInstructions: '',
    },
  });

  const handleApplyInstructions = (newText: string) => {
    const current = methods.getValues('additionalInstructions');
    const updated = current ? `${current}\n${newText}` : newText;
    methods.setValue('additionalInstructions', updated);
  };

  const handleNext = async () => {
    const isValid = await methods.trigger(['title', 'subject', 'grade', 'schoolName', 'dueDate', 'timeLimit']);
    if (isValid) {
      setStep(2);
    }
  };

  const handlePrevious = () => {
    setStep(1);
  };

  const onSubmit = async (values: any) => {
    if (step === 1) {
      handleNext();
      return;
    }

    try {
      setLoading(true);
      
      const cleanConfig = values.questionConfig.map((q: any) => ({
        type: q.type,
        count: Number(q.count),
        marksEach: Number(q.marksEach),
      }));

      const created = await assignmentService.create({
        title: values.title,
        subject: values.subject,
        grade: values.grade,
        schoolName: values.schoolName,
        assignedBy: 'Aayush',
        dueDate: values.dueDate,
        timeLimit: Number(values.timeLimit),
        fileUrl: values.fileUrl || undefined,
        questionConfig: cleanConfig,
        additionalInstructions: values.additionalInstructions || undefined,
      });

      // Safely extract the ID in case it was returned as `id`, `_id`, or inside an array.
      const assignmentObj = Array.isArray(created) ? created[0] : created;
      const assignmentId = assignmentObj._id || assignmentObj.id;
      
      if (!assignmentId) {
        throw new Error('Invalid response from server: Assignment ID is missing');
      }

      const triggered = await assignmentService.generate(assignmentId);
      
      setActiveJobId(triggered.jobId);
      setJobStatus('generating');
      
      showToast('Assignment enqueued for generation!', 'success');
      router.push(`/assignments/${created._id}`);
    } catch (err) {
      showToast((err as Error).message || 'Failed to submit assignment', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <h1 className="text-lg font-bold text-neutral-900 leading-none">Create Assignment</h1>
      </div>
      <p className="text-xs text-neutral-500 -mt-4 pl-4.5 font-medium">
        Set up a new assignment for your students
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <FormProgressBar step={step} />

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xs border border-neutral-100 p-6 md:p-8">
                {step === 1 ? <StepDetails /> : <StepQuestions />}
              </div>

              <div className="flex justify-between items-center px-1">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={step === 1}
                  className="flex items-center gap-2 border border-neutral-300 bg-white hover:bg-neutral-50 rounded-full px-5 py-2.5 text-xs font-bold text-neutral-700 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </button>

                {step === 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full px-5 py-2.5 text-xs font-bold transition-all active:scale-95 shadow-md hover:shadow-lg"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-dark text-white rounded-full px-6 py-2.5 text-xs font-bold hover:opacity-90 transition-all active:scale-95 shadow-md hover:shadow-lg"
                  >
                    Submit & Generate <Sparkles className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>

        {/* Right Column: AI Toolkit */}
        <div className="lg:col-span-1">
          <AiToolkitPanel
            mode="form"
            onApplyInstructions={handleApplyInstructions}
          />
        </div>
      </div>
    </div>
  );
}
