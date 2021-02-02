import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";

const StreamView = () => {
  const { project, streamId } = useParams<{ project: string, streamId: string }>()
  const [{ data: stream = {} }] = useAxios<{ [timestamp: string]: any }>('/api/projects/' + project + '/streams/' + streamId, { });

  const events = Object.entries(stream).map(([timestamp, data]): [number, any] => [parseInt(timestamp), data]).sort((a, b) => a[0] - b[0]);

  return (
    <>
      <h2><code>{streamId}</code></h2>
      {events.map(([timestamp, data]) => <p className={'panel'}>{new Date(timestamp).toLocaleString()}: <code><pre style={{ marginBottom: 0 }}>{Object.entries(data).map(([a, b]) => a.toString() + ': ' + (b as any)).join('\n')}</pre></code></p>)}
    </>
  );
}

export default StreamView;
