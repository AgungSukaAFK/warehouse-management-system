import { Check, CheckCheck, Hourglass } from "lucide-react";
import { Button } from "./ui/button";

type StepperProps = {
  steps: Step[];
};

export interface Step {
  title: string;
  description?: string;
  status?: "active" | "completed" | "skipped";
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
                  {/* PR */}
                  {steps[index - 1].status === "completed" &&
                    step.title === "Purchase Request" && (
                      <Button
                        className="mt-2"
                        variant={"outline"}
                        size={"sm"}
                        asChild
                      >
                        <a href="/purchase-request">Ke halaman PR</a>
                      </Button>
                    )}

                  {/* PO */}
                  {steps[index - 1].status === "completed" &&
                    step.title === "Purchase Order" && (
                      <Button
                        className="mt-2"
                        variant={"outline"}
                        size={"sm"}
                        asChild
                      >
                        <a href="/purchase-order">Ke halaman PO</a>
                      </Button>
                    )}

                  {/* Delivery */}
                  {steps[index - 1].status === "completed" &&
                    step.title === "Delivery" && (
                      <Button
                        className="mt-2"
                        variant={"outline"}
                        size={"sm"}
                        asChild
                      >
                        <a href="/delivery">Ke halaman Delivery</a>
                      </Button>
                    )}
                </div>
              </div>
            </div>
          );
        } else if (step.status === "completed") {
          return (
            <div key={index}>
              <div className="border-l-4 border-green-500 px-2 pb-4 pt-1 flex gap-2">
                <div className="bg-green-500 h-fit rounded-full p-1 shadow-sm">
                  <Check size={16} />
                </div>
                <div className="text-base">
                  <h1 className="font-bold">{step.title}</h1>
                  <p>{step.description}</p>
                </div>
              </div>
            </div>
          );
        } else if (step.status === "skipped") {
          return (
            <div key={index}>
              <div className="border-l-4 border-green-500 px-2 pb-4 pt-1 flex gap-2">
                <div className="bg-green-500 h-fit rounded-full p-1 shadow-sm">
                  <CheckCheck size={16} />
                </div>
                <div className="text-base  line-through text-muted-foreground">
                  <h1 className="font-bold">{step.title}</h1>
                  <p>{step.description}</p>
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
