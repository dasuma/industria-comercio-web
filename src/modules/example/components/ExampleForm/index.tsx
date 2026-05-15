'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Hint, Input, Label, toast } from '@biaenergy/ui';
import { useCreateExample } from '../../data/actions/createExample';
import { getExampleDict } from '../../dictionaries';
import type { Locale } from '@/i18n/config';

interface ExampleFormProps {
  locale: Locale;
}

export const ExampleForm = ({ locale }: ExampleFormProps) => {
  const dict = getExampleDict(locale);
  const { mutate, isPending } = useCreateExample();

  const schema = z.object({
    title: z
      .string()
      .min(1, dict.form.errors.titleRequired)
      .max(100, dict.form.errors.titleTooLong),
    body: z.string().min(1, dict.form.errors.bodyRequired).max(500, dict.form.errors.bodyTooLong)
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', body: '' }
  });

  const onSubmit = handleSubmit(values => {
    mutate(
      { ...values, userId: 1 },
      {
        onSuccess: () => {
          reset();
          toast.success(dict.form.success);
        },
        onError: () => toast.error(dict.form.errors.serverError)
      }
    );
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
      <h3 className="text-text-strong-950 font-medium">{dict.form.title}</h3>

      <div className="flex flex-col gap-1">
        <Label.Root htmlFor="example-title">{dict.form.fields.title}</Label.Root>
        <Input.Root hasError={Boolean(errors.title)}>
          <Input.Wrapper>
            <Input.Input id="example-title" {...register('title')} />
          </Input.Wrapper>
        </Input.Root>
        {errors.title && <Hint.Root hasError>{errors.title.message}</Hint.Root>}
      </div>

      <div className="flex flex-col gap-1">
        <Label.Root htmlFor="example-body">{dict.form.fields.body}</Label.Root>
        <Input.Root hasError={Boolean(errors.body)}>
          <Input.Wrapper>
            <Input.Input id="example-body" {...register('body')} />
          </Input.Wrapper>
        </Input.Root>
        {errors.body && <Hint.Root hasError>{errors.body.message}</Hint.Root>}
      </div>

      <Button.Root
        type="submit"
        variant="primary"
        mode="filled"
        size="medium"
        disabled={isPending}
        className="self-start"
      >
        {isPending ? dict.form.actions.submitting : dict.form.actions.submit}
      </Button.Root>
    </form>
  );
};
