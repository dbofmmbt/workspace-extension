import React from "react";
import { useForm } from "react-hook-form";

type FormProps = {
  submitHandler: (input: FormInput) => void;
};

export interface FormInput {
  workspaceName: string;
}

export const WorkspaceForm = ({ submitHandler }: FormProps) => {
  const { register, errors, handleSubmit } = useForm<FormInput>();
  return (
    <div>
      <form onSubmit={handleSubmit(submitHandler)}>
        {errors.workspaceName && "First name is required"}
        <input
          name="workspaceName"
          ref={register({ required: true })}
          placeholder="Workspace Name"
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};
