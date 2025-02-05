// interface class for dealing with date calculations/formats

import moment, { Moment } from "moment";

export interface TlEventData {
  title: string;
  startDate: [year: number, month: number, day: number];
  endDate: [year: number, month: number, day: number];
}

export class TlEventHelper {
  // get date values
  static convertToDisplayDate(date: TlEventData["startDate"]) {
    const [year, month, day] = date;
    const result = moment(0);

    if (year != null) {
      result.year(year);
    }
    if (month != null) {
      result.month(month - 1);
    }
    if (day != null) {
      result.date(day);
    }
    return result;
  }

  // get date format
  static convertToDisplayDateFormat(date: TlEventData["startDate"]) {
    const [year, month, day] = date;
    let format = "YYYY";

    if (month != null) {
      format = "MMMM YYYY";
    }
    if (day != null) {
      format = "D. MMMM YYYY";
    }

    return format;
  }

  // get display date: date.format + add BCE & remove "-"
  static displayDate(date: TlEventData["startDate"]) {
    const yearBCE = this.checkForYearBC(date);
    let displayDate;
    if (yearBCE) {
      displayDate = this.convertToDisplayDate(date).format(
        this.convertToDisplayDateFormat(date)
      );
      return displayDate.replace("-", "") + " BCE";
    } else {
      displayDate = this.convertToDisplayDate(date).format(
        this.convertToDisplayDateFormat(date)
      );
      return displayDate;
    }
  }

  // check if year includes "-"
  static checkForYearBC(date: TlEventData["startDate"]) {
    const year = date[0];
    const yearString = year.toString();
    if (yearString.includes("-")) {
      return true;
    }
    return false;
  }
}