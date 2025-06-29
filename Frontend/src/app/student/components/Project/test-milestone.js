import * as ProjectsAPI from '../../../../api/StudentApi/Projects';

console.log('All exports from Projects:', Object.keys(ProjectsAPI));
console.log('addMilestone function:', ProjectsAPI.addMilestone);
console.log('typeof addMilestone:', typeof ProjectsAPI.addMilestone);

export default function TestMilestone() {
  return <div>Testing milestone imports</div>;
}
