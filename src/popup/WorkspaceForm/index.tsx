import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

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
      <Form onSubmit={handleSubmit(submitHandler)}>
        {errors.workspaceName && "First name is required"}
        <FormInput
          name="workspaceName"
          ref={register({ required: true })}
          placeholder="Workspace Name"
        />
        <FormButton type="submit">Create</FormButton>
      </Form>
    </div>
  );
};

const Form = styled.form`
  margin-left: 5px;
`;

const FormInput = styled.input`
  width: 110px;
`;

const FormButton = styled.button`
  width: 100%;
`;
