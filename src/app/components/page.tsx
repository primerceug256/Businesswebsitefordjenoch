import { supabase } from "@/utils/supabase/info";
import VideoPlayer from "@/app/components/player/VideoPlayer";
import Protected from "@/app/components/auth/Protected";

export default async function MoviePage({ params }: any) {
  const { data } = await supabase
    .from("movies")
    .select("*")
    .eq("id", params.id)
    .single();

  return (
    <Protected>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
        <VideoPlayer src={data.video_url} />
      </div>
    </Protected>
  );
}