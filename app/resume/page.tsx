export const metadata = { title: 'Resume - Jensy Jimenez' };

export default function Page() {
  return (
    <div className="space-y-4">
      <p>Download my resume or request access.</p>
      <div className="flex gap-2">
        <a
          href="https://drive.google.com/file/d/1bZcieLdSade3vL9hwJmCRbwznRNZDLza/view"
          className="bg-brand text-brand-contrast px-4 py-2 rounded"
        >
          View Resume
        </a>
        <a
          href="https://drive.google.com/file/d/18VpCu_82mwLvJRqUC16T8irtDe5k-Wub/view"
          className="border px-4 py-2 rounded"
        >
          Request Access
        </a>
      </div>
    </div>
  );
}
