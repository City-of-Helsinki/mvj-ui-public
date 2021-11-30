export type ApiAttribute = {
  label: string;
  read_only: boolean;
  required: boolean;
  type: string;
  choices?: Array<{
    display_name: string;
    value: string | number;
  }>;
  child?: {
    read_only: boolean;
    required: boolean;
    type: string;
    children: Record<string, ApiAttribute>;
  };
};

export type ApiAttributes = Record<string, ApiAttribute>;
