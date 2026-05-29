
import Link from 'next/link';
import { Metadata } from 'next';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/language/useLanguage';

export const metadata: Metadata = {
    title: 'Page Not Found | Modern Auth',
    description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
    const { t } = useLanguage();
    return (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
            <div className="text-center max-w-lg">
                <h1 className="text-9xl font-bold text-primary">404</h1>

                <div className="mt-8 space-y-6">
                    <h2 className="text-3xl font-bold">{t('notFound.title')}</h2>

                    <p className="text-lg opacity-80">
                        {t('notFound.description')}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <Link href="/">
                            <Button size="lg">
                                {t('notFound.returnHome')}
                            </Button>
                        </Link>
                        <Link href="https://www.bureau-vallee.re/fr_RE/nous-contacter">
                            <Button variant="outline" size="lg">
                                {t('notFound.contactSupport')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}