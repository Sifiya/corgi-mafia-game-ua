import { useTranslationContext } from '@/lib/i18n/context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';

export const DonateLink = () => {
  const i18n = useTranslationContext();
  return (
    <Card class="p-2 border-border/50">
      <CardHeader class="flex flex-col justify-center items-center">
        <CardTitle>{i18n.t('DONATE_TITLE')}</CardTitle>
        <CardDescription>{i18n.t('DONATE_DESCRIPTION')}</CardDescription>
      </CardHeader>
      <CardContent class="flex justify-center items-center">
        <div class="relative w-[150px] h-[150px] overflow-hidden">
          <img src="https://send.monobank.ua/img/jar_bg.png" alt="Підкладка для банки монобанка" />
          <img
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px]"
            src="https://send.monobank.ua/img/jar/uah_50.png"
            alt="Банка монобанка" />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          as="a"
          href="https://send.monobank.ua/jar/4mKWeUUv4p"
          target="_blank"
          size="lg"
          variant="default"
          class="w-full">
          <i class="ri-hand-heart-fill mr-1.5 mb-0.5 text-lg" />

          {i18n.t('DONATE_BUTTON')}

        </Button>
      </CardFooter>
    </Card>
  );
};