import { mechanical } from "./mechanical";
import { psychology } from "./psychology";
import { sociology } from "./sociology";
export const departments = [psychology, mechanical, sociology];
export const getDepartment = (id: string) => departments.find((department) => department.id === id);
