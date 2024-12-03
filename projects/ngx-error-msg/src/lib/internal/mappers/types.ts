import { ErrorMessageMapper } from '../data/mappings';

export type MappedMessage = { error: string; message: string };
export type MappingEntry = [string, ErrorMessageMapper];
