import PrivateChat from "@/components/PrivateChat";

async function page({ params }: { params: { room: string } }) {
  const { room } = await params;

  return <PrivateChat roomName={room} />;
}

export default page;
