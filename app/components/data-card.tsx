import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

export function DataCard({
  title,
  description,
  dataSourceUrl,
}: {
  title: string;
  description: string;
  dataSourceUrl: string;
}) {
  return (
    <Card className="w-[350px] absolute top-0 right-0 m-4 z-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <a
          href={dataSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:underline"
        >
          View Data Source
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </CardContent>
    </Card>
  );
}
