export interface Account {
  id: string;
  name: string;
  members: string[];
  participants: Participant[];
}

export interface Participant {
  name: string;
  weight: number;
}
