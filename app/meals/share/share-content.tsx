'use client';

import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { useCreateMeal } from '@/hooks/meals/useCreateMeal';
import { useUpdateMeal } from '@/hooks/meals/useUpdateMeal';
import ImagePicker from '@/components/meals/image-picker';
import { Meal, MealFormData } from '@/types/meal';

import classes from './page.module.css';

interface ShareContentProps {
    meal?: Meal;
}

export default function ShareContent({ meal }: ShareContentProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const createMeal = useCreateMeal();
    const updateMeal = useUpdateMeal();
    const isEditMode = !!meal;
    const mutation = isEditMode ? updateMeal : createMeal;

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors }
    } = useForm<MealFormData>({
        values: {
            name: meal?.creator ?? session?.user?.name ?? '',
            email: meal?.creator_email ?? session?.user?.email ?? '',
            title: meal?.title ?? '',
            summary: meal?.summary ?? '',
            instructions: meal?.instructions ?? '',
            image: null,
        },
    });

    const onSubmit = async (data: MealFormData) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('summary', data.summary);
        formData.append('instructions', data.instructions);
        if (data.image) formData.append('image', data.image);

        try {
            if (isEditMode) {
                await updateMeal.mutateAsync({ slug: meal.slug, formData });
                router.push(`/meals/${meal.slug}`);
            } else {
                formData.append('name', data.name);
                formData.append('email', data.email);
                await createMeal.mutateAsync(formData);
                router.push('/meals');
            }
        } catch (error) {
            console.error('Failed to submit meal:', error);
        }
    };

    return (
        <>
            {isEditMode && (
                <div className={classes.backNav}>
                    <Link href={`/meals/${meal.slug}`} className={classes.backLink}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back to meal
                    </Link>
                </div>
            )}
            <header className={classes.header}>
                <h1>
                    {isEditMode
                        ? <>Edit <span className={classes.highlight}>{meal.title}</span></>
                        : <>Share your <span className={classes.highlight}>favorite meal</span></>
                    }
                </h1>
                {!isEditMode && <p>Or any other meal you feel needs sharing!</p>}
            </header>
            <main className={classes.main}>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                    {!isEditMode && (
                        <div className={classes.row}>
                            <p>
                                <label htmlFor="name">Your name</label>
                                <input
                                    type="text"
                                    id="name"
                                    readOnly={!!session?.user?.name}
                                    {...register('name', { required: 'Name is required' })}
                                />
                                {errors.name && <span className={classes.error}>{errors.name.message}</span>}
                            </p>
                            <p>
                                <label htmlFor="email">Your email</label>
                                <input
                                    type="email"
                                    id="email"
                                    readOnly={!!session?.user?.email}
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                />
                                {errors.email && <span className={classes.error}>{errors.email.message}</span>}
                            </p>
                        </div>
                    )}
                    <p>
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            title={watch('title') || undefined}
                            {...register('title', { required: 'Title is required' })}
                        />
                        {errors.title && <span className={classes.error}>{errors.title.message}</span>}
                    </p>
                    <p>
                        <label htmlFor="summary">Short Summary</label>
                        <input
                            type="text"
                            id="summary"
                            title={watch('summary') || undefined}
                            {...register('summary', { required: 'Summary is required' })}
                        />
                        {errors.summary && <span className={classes.error}>{errors.summary.message}</span>}
                    </p>
                    <p>
                        <label htmlFor="instructions">Instructions</label>
                        <textarea
                            id="instructions"
                            rows={10}
                            {...register('instructions', { required: 'Instructions are required' })}
                        ></textarea>
                        {errors.instructions && <span className={classes.error}>{errors.instructions.message}</span>}
                    </p>

                    <Controller
                        name="image"
                        control={control}
                        rules={{ required: isEditMode ? false : 'Image is required' }}
                        render={({ field: { onChange }, fieldState: { error } }) => (
                            <ImagePicker
                                label={isEditMode ? 'New image (optional)' : 'Your image'}
                                name="image"
                                onChange={onChange}
                                error={error?.message}
                            />
                        )}
                    />

                    {mutation.error && (
                        <p className={classes.error}>{mutation.error.message}</p>
                    )}

                    <p className={classes.actions}>
                        <button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending
                                ? (isEditMode ? 'Saving...' : 'Submitting...')
                                : (isEditMode ? 'Save Changes' : 'Share Meal')
                            }
                        </button>
                    </p>
                </form>
            </main>
        </>
    );
}
