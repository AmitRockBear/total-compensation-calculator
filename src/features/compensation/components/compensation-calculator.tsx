
import { useForm } from "@tanstack/react-form";

import { BenefitsSection } from "./sections/benefits-section";
import { EsppSection } from "./sections/espp-section";
import { RaisesSection } from "./sections/raises-section";
import { RecurringCompensationSection } from "./sections/recurring-compensation-section";
import { RsuSection } from "./sections/rsu-section";
import { SummaryPanel } from "./summary-panel";
import { getDefaultFormValues } from "~/features/compensation/lib/defaults";
import { useCompensationSummary } from "~/features/compensation/hooks/use-compensation-summary";
import { FormContext } from "~/features/compensation/components/forms/form-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const CalculatorContent = () => {
  const summary = useCompensationSummary();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_500px] xl:grid-cols-[1fr_540px]">
      {/* Left Column - Tabbed Input Sections */}
      <Tabs defaultValue="salary" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="salary">Salary & Benefits</TabsTrigger>
          <TabsTrigger value="equity">Equity (RSU)</TabsTrigger>
          <TabsTrigger value="espp">ESPP</TabsTrigger>
          <TabsTrigger value="raises">Raises</TabsTrigger>
        </TabsList>
        
        <TabsContent value="salary" className="space-y-6 mt-6">
          <RecurringCompensationSection />
          <BenefitsSection />
        </TabsContent>
        
        <TabsContent value="equity" className="mt-6">
          <RsuSection />
        </TabsContent>
        
        <TabsContent value="espp" className="mt-6">
          <EsppSection />
        </TabsContent>
        
        <TabsContent value="raises" className="mt-6">
          <RaisesSection />
        </TabsContent>
      </Tabs>

      {/* Right Column - Live Summary (Sticky on desktop) */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <SummaryPanel summary={summary} />
      </div>
    </div>
  );
};

export const CompensationCalculator = () => {
  const form = useForm({
    defaultValues: getDefaultFormValues(),
  });

  return (
    <FormContext.Provider value={form}>
      <CalculatorContent />
    </FormContext.Provider>
  );
};
