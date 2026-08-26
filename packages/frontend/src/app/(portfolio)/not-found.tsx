import Button from "@components/Shared/Button";
import Content from "@components/Shared/Content";
import PageHeader from "@components/Shared/PageHeader";

export default function NotFound() {
  return (
    <main>
      <Content>
        <PageHeader
          title="Not here"
          lede="That page does not exist — or it did and no longer does."
          actions={<Button href="/">Back to the work</Button>}
        />
      </Content>
    </main>
  );
}
