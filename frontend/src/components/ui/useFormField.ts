import * as React from "react";
import { useFormContext } from "react-hook-form";
import { FormFieldContext, FormItemContext } from "./form.context";

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>");
  }

  const fieldState = getFieldState(
    (fieldContext as { name: string }).name,
    formState
  );

  const { id } = itemContext as { id: string };

  return {
    id,
    name: (fieldContext as { name: string }).name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};
