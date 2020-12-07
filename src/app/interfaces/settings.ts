import Site from '../classes/site';
import ApplicationDef from '../classes/application';
import ProcessDef from '../classes/process';

export interface AppSettings {
  processInfo:ProcessDef;
  processlist:Array<ProcessDef>;
  applicationlist:Array<ApplicationDef>;
  sitelist:Array<Site>;
  siteId: string;
  applicationId: string;
  processId: string;
  siteUpdated: boolean;
  applicationUpdated: boolean;
  processUpdated: boolean;
  processInfoUpdated: boolean;
}
