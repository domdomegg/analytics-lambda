import useAxios from "axios-hooks";
import { NavLink, useParams } from "react-router-dom";

const ProjectView = ({ children }: { children: React.ReactNode }) => {
  const { project } = useParams<{ project: string }>()
  const [{ data: streamIds = [] }] = useAxios<string[]>('/api/projects/' + project + '/streams', { });

  return (
    <>
      <div className="sidebarView">
        <div className="left panel">
          <h2>Streams</h2>
          <ul className="select">
            {streamIds.map(streamId => <li key={streamId}><NavLink to={'/' + project + '/' + streamId}>{streamId}</NavLink></li>)}
          </ul>
        </div>
        <div className="right panel">
          {children}
        </div>
      </div>
    </>
  );
}

export default ProjectView;
