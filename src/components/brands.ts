import * as si from "simple-icons";

/** Brands shown in the stack strip. `icon` is a Simple Icons key where the set carries the mark.
 *  Brands without one render as a wordmark unless an official SVG is dropped at public/brands/<slug>.svg.
 *  Trademarks belong to their owners; follow each brand's guidelines before publishing their mark. */
export type Brand = { slug: string; name: string; icon?: keyof typeof si };

export const models: Brand[] = [
  { slug: "openai", name: "OpenAI" },
  { slug: "anthropic", name: "Anthropic", icon: "siAnthropic" },
  { slug: "google-gemini", name: "Google Gemini", icon: "siGooglegemini" },
  { slug: "mistral", name: "Mistral AI", icon: "siMistralai" },
  { slug: "meta-llama", name: "Meta Llama", icon: "siMeta" },
  { slug: "hugging-face", name: "Hugging Face", icon: "siHuggingface" },
  { slug: "azure-openai", name: "Azure OpenAI" },
  { slug: "aws-bedrock", name: "AWS Bedrock" },
];

export const systems: Brand[] = [
  { slug: "salesforce", name: "Salesforce" },
  { slug: "sap", name: "SAP", icon: "siSap" },
  { slug: "servicenow", name: "ServiceNow" },
  { slug: "workday", name: "Workday" },
  { slug: "microsoft-365", name: "Microsoft 365" },
  { slug: "google-workspace", name: "Google Workspace", icon: "siGoogle" },
  { slug: "snowflake", name: "Snowflake", icon: "siSnowflake" },
  { slug: "databricks", name: "Databricks", icon: "siDatabricks" },
  { slug: "zendesk", name: "Zendesk", icon: "siZendesk" },
  { slug: "jira", name: "Jira", icon: "siJira" },
  { slug: "hubspot", name: "HubSpot", icon: "siHubspot" },
];

export function iconFor(b: Brand): { path: string; hex: string } | null {
  if (!b.icon) return null;
  const i = si[b.icon] as { path: string; hex: string } | undefined;
  return i ? { path: i.path, hex: i.hex } : null;
}
