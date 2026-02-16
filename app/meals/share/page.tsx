import { Metadata } from 'next';
import ShareContent from './share-content';

export const metadata: Metadata = {
    title: 'Share a Meal | Ukrainian Food',
    description: 'Share your favorite Ukrainian meal recipe with the community.',
};

export default function ShareMealPage() {
    return <ShareContent />;
}
