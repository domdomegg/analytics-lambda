import useAxios from "axios-hooks";
import { Link } from "react-router-dom";

const HomeView = () => {
  const [{ data: projects = [] }] = useAxios<string[]>('/api/projects', { });

  return (
    <>
      <div className="panel">
        <h2>Choose a project</h2>
        <ul className="select">
          {projects.map(project => <li key={project}><Link to={'/' + project}>{project}</Link></li>)}
        </ul>
      </div>
    </>
  );
}

export default HomeView;
