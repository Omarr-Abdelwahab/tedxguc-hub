import * as React from "react";
import { Controller, type ControllerProps, type FieldPath, type FieldValues } from "react-hook-form";
import { FormFieldContext, type FormFieldContextValue } from "./form.context";

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name } as FormFieldContextValue<TFieldValues, TName>}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

