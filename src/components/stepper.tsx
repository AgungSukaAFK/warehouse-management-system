import { Check, CheckCheck, Hourglass } from "lucide-react";

type StepperProps = {
  steps: Step[];
};

export interface Step {
  title: string;
  description?: string;
  status?: "active" | "completed" | "skipped";
  cta?: React.ReactNode;
}

export default function Stepper({ steps }: StepperProps) {
  return (
    <div>
      {steps.map((step, index) => {
        if (step.status === "active") {
          return (
            <div key={index}>
              <div className="border-l-4 border-slate-300 px-2 pb-4 pt-1 flex gap-2">
                <div className="bg-muted h-fit rounded-full p-1 shadow-sm">
                  <Hourglass size={16} />
                </div>
                <div className="text-base">
                  <h1 className="font-bold">{step.title}</h1>
                  <p>{step.description}</p>
                  {step.cta && <div className="mt-2">{step.cta}</div>}
                </div>
              </div>
            </div>
          );
        } else if (step.status === "completed") {
          return (
            <div>
              <div className="border-l-4 border-green-500 px-2 pb-4 pt-1 flex gap-2">
                <div className="bg-green-500 h-fit rounded-full p-1 shadow-sm">
                  <Check size={16} />
                </div>
                <div className="text-base">
                  <h1 className="font-bold">{step.title}</h1>
                  <p>{step.description}</p>
                  {step.cta && <div className="mt-2">{step.cta}</div>}
                </div>
              </div>
            </div>
          );
        } else if (step.status === "skipped") {
          return (
            <div>
              <div className="border-l-4 border-green-500 px-2 pb-4 pt-1 flex gap-2">
                <div className="bg-green-500 h-fit rounded-full p-1 shadow-sm">
                  <CheckCheck size={16} />
                </div>
                <div className="text-base  line-through text-muted-foreground">
                  <h1 className="font-bold">{step.title}</h1>
                  <p>{step.description}</p>
                  {step.cta && <div className="mt-2">{step.cta}</div>}
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
