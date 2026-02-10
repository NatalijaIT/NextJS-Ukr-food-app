'use client';

import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { useCreateMeal } from '@/hooks/meals/useCreateMeal';
import ImagePicker from '@/components/meals/image-picker';

import classes from './page.module.css';

export default function ShareMealPage() {
    const router = useRouter();
    const createMeal = useCreateMeal();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            title: '',
            summary: '',
            instructions: '',
            image: null
        }
    });

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('title', data.title);
        formData.append('summary', data.summary);
        formData.append('instructions', data.instructions);
        formData.append('image', data.image);

        try {
            await createMeal.mutateAsync(formData);
            router.push('/meals');
        } catch (error) {
            console.error('Failed to create meal:', error);
        }
    };

    return (
        <>
            <header className={classes.header}>
                <h1>
                    Share your <span className={classes.highlight}>favorite meal</span>
                </h1>
                <p>Or any other meal you feel needs sharing!</p>
            </header>
            <main className={classes.main}>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className={classes.row}>
                        <p>
                            <label htmlFor="name">Your name</label>
                            <input
                                type="text"
                                id="name"
                                {...register('name', {
                                    required: 'Name is required'
                                })}
                            />
                            {errors.name && <span className={classes.error}>{errors.name.message}</span>}
                        </p>
                        <p>
                            <label htmlFor="email">Your email</label>
                            <input
                                type="email"
                                id="email"
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
                    <p>
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            {...register('title', {
                                required: 'Title is required'
                            })}
                        />
                        {errors.title && <span className={classes.error}>{errors.title.message}</span>}
                    </p>
                    <p>
                        <label htmlFor="summary">Short Summary</label>
                        <input
                            type="text"
                            id="summary"
                            {...register('summary', {
                                required: 'Summary is required'
                            })}
                        />
                        {errors.summary && <span className={classes.error}>{errors.summary.message}</span>}
                    </p>
                    <p>
                        <label htmlFor="instructions">Instructions</label>
                        <textarea
                            id="instructions"
                            rows="10"
                            {...register('instructions', {
                                required: 'Instructions are required'
                            })}
                        ></textarea>
                        {errors.instructions && <span className={classes.error}>{errors.instructions.message}</span>}
                    </p>

                    <Controller
                        name="image"
                        control={control}
                        rules={{ required: 'Image is required' }}
                        render={({ field: { onChange }, fieldState: { error } }) => (
                            <ImagePicker
                                label="Your image"
                                name="image"
                                onChange={onChange}
                                error={error?.message}
                            />
                        )}
                    />

                    {createMeal.error && (
                        <p className={classes.error}>{createMeal.error.message}</p>
                    )}

                    <p className={classes.actions}>
                        <button type="submit" disabled={createMeal.isPending}>
                            {createMeal.isPending ? 'Submitting...' : 'Share Meal'}
                        </button>
                    </p>
                </form>
            </main>
        </>
    );
}
