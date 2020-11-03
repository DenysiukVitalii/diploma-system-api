export class CreateProtectionDto {
  protectionTypeId: number;
  groupId: number;
  teacherIds: number[];
  studentsIds: number[];
  date: Date;
  place: string;
}
