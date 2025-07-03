// Date utility functions for the invoice app

export type DateFormat = 'short' | 'long' | 'iso' | 'display' | 'compact' | 'full';
export type DatePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface DateRange {
    start: string;
    end: string;
}

export interface DatePeriodInfo {
    label: string;
    start: string;
    end: string;
    days: number;
}

export interface RelativeTimeOptions {
    includeSeconds?: boolean;
    shortFormat?: boolean;
}

/**
 * Formats a date string in various formats
 */
export const formatDate = (
    dateString: string,
    format: DateFormat = 'short'
): string => {
    try {
        const date = new Date(dateString);

        // Check for invalid date
        if (isNaN(date.getTime())) {
            return dateString;
        }

        switch (format) {
            case 'short':
                return date.toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                });

            case 'long':
                return date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

            case 'iso':
                return date.toISOString().split('T')[0];

            case 'display':
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });

            case 'compact':
                return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                });

            case 'full':
                return date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }) + ' at ' + date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });

            default:
                return dateString;
        }
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
};

/**
 * Gets the current date in various formats
 */
export const getCurrentDate = (format: DateFormat = 'iso'): string => {
    const now = new Date();

    if (format === 'iso') {
        return now.toISOString().split('T')[0];
    }

    return formatDate(now.toISOString(), format);
};

/**
 * Gets the current date and time
 */
export const getCurrentDateTime = (): string => {
    return new Date().toISOString();
};

/**
 * Adds days to a date
 */
export const addDays = (dateString: string, days: number): string => {
    try {
        const date = new Date(dateString);
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    } catch (error) {
        console.error('Error adding days to date:', error);
        return dateString;
    }
};

/**
 * Subtracts days from a date
 */
export const subtractDays = (dateString: string, days: number): string => {
    return addDays(dateString, -days);
};

/**
 * Adds months to a date
 */
export const addMonths = (dateString: string, months: number): string => {
    try {
        const date = new Date(dateString);
        date.setMonth(date.getMonth() + months);
        return date.toISOString().split('T')[0];
    } catch (error) {
        console.error('Error adding months to date:', error);
        return dateString;
    }
};

/**
 * Adds years to a date
 */
export const addYears = (dateString: string, years: number): string => {
    try {
        const date = new Date(dateString);
        date.setFullYear(date.getFullYear() + years);
        return date.toISOString().split('T')[0];
    } catch (error) {
        console.error('Error adding years to date:', error);
        return dateString;
    }
};

/**
 * Calculates the number of days between two dates
 */
export const getDaysBetween = (startDate: string, endDate: string): number => {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
        console.error('Error calculating days between dates:', error);
        return 0;
    }
};

/**
 * Calculates the number of business days between two dates (excludes weekends)
 */
export const getBusinessDaysBetween = (startDate: string, endDate: string): number => {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        let businessDays = 0;
        let currentDate = new Date(start);

        while (currentDate <= end) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
                businessDays++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return businessDays;
    } catch (error) {
        console.error('Error calculating business days:', error);
        return 0;
    }
};

/**
 * Checks if a date is within a range
 */
export const isDateInRange = (
    date: string,
    startDate: string,
    endDate: string
): boolean => {
    try {
        const target = new Date(date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return target >= start && target <= end;
    } catch (error) {
        console.error('Error checking date range:', error);
        return false;
    }
};

/**
 * Checks if first date is before second date
 */
export const isDateBefore = (date1: string, date2: string): boolean => {
    try {
        return new Date(date1) < new Date(date2);
    } catch (error) {
        console.error('Error comparing dates:', error);
        return false;
    }
};

/**
 * Checks if first date is after second date
 */
export const isDateAfter = (date1: string, date2: string): boolean => {
    try {
        return new Date(date1) > new Date(date2);
    } catch (error) {
        console.error('Error comparing dates:', error);
        return false;
    }
};

/**
 * Checks if a date is today
 */
export const isToday = (dateString: string): boolean => {
    try {
        const date = new Date(dateString);
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    } catch (error) {
        console.error('Error checking if date is today:', error);
        return false;
    }
};

/**
 * Checks if a date is yesterday
 */
export const isYesterday = (dateString: string): boolean => {
    try {
        const date = new Date(dateString);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return (
            date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear()
        );
    } catch (error) {
        console.error('Error checking if date is yesterday:', error);
        return false;
    }
};

/**
 * Checks if a date is tomorrow
 */
export const isTomorrow = (dateString: string): boolean => {
    try {
        const date = new Date(dateString);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return (
            date.getDate() === tomorrow.getDate() &&
            date.getMonth() === tomorrow.getMonth() &&
            date.getFullYear() === tomorrow.getFullYear()
        );
    } catch (error) {
        console.error('Error checking if date is tomorrow:', error);
        return false;
    }
};

/**
 * Checks if a date is past due (before today)
 */
export const isPastDue = (dueDateString: string): boolean => {
    try {
        const dueDate = new Date(dueDateString);
        const today = new Date();

        // Set hours to 0 to compare only dates, not times
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);

        return dueDate < today;
    } catch (error) {
        console.error('Error checking if date is past due:', error);
        return false;
    }
};

/**
 * Checks if a date is this week
 */
export const isThisWeek = (dateString: string): boolean => {
    try {
        const date = new Date(dateString);
        const today = new Date();

        // Get start of this week (Sunday)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        // Get end of this week (Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return date >= startOfWeek && date <= endOfWeek;
    } catch (error) {
        console.error('Error checking if date is this week:', error);
        return false;
    }
};

/**
 * Checks if a date is this month
 */
export const isThisMonth = (dateString: string): boolean => {
    try {
        const date = new Date(dateString);
        const today = new Date();
        return (
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    } catch (error) {
        console.error('Error checking if date is this month:', error);
        return false;
    }
};

/**
 * Checks if a date is this year
 */
export const isThisYear = (dateString: string): boolean => {
    try {
        const date = new Date(dateString);
        const today = new Date();
        return date.getFullYear() === today.getFullYear();
    } catch (error) {
        console.error('Error checking if date is this year:', error);
        return false;
    }
};

/**
 * Gets the quarter number (1-4) for a date
 */
export const getQuarter = (dateString: string): number => {
    try {
        const date = new Date(dateString);
        const month = date.getMonth();
        return Math.floor(month / 3) + 1;
    } catch (error) {
        console.error('Error getting quarter:', error);
        return 1;
    }
};

/**
 * Gets the start of the month for a given date
 */
export const getStartOfMonth = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        date.setDate(1);
        return date.toISOString().split('T')[0];
    } catch (error) {
        console.error('Error getting start of month:', error);
        return dateString;
    }
};

/**
 * Gets the end of the month for a given date
 */
export const getEndOfMonth = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        date.setMonth(date.getMonth() + 1, 0);
        return date.toISOString().split('T')[0];
    } catch (error) {
        console.error('Error getting end of month:', error);
        return dateString;
    }
};

/**
 * Gets the start of the year for a given date
 */
export const getStartOfYear = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        date.setMonth(0, 1);
        return date.toISOString().split('T')[0];
    } catch (error) {
        console.error('Error getting start of year:', error);
        return dateString;
    }
};

/**
 * Gets the end of the year for a given date
 */
export const getEndOfYear = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        date.setMonth(11, 31);
        return date.toISOString().split('T')[0];
    } catch (error) {
        console.error('Error getting end of year:', error);
        return dateString;
    }
};

/**
 * Gets the start of the week for a given date
 */
export const getStartOfWeek = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        return startOfWeek.toISOString().split('T')[0];
    } catch (error) {
        console.error('Error getting start of week:', error);
        return dateString;
    }
};

/**
 * Gets the end of the week for a given date
 */
export const getEndOfWeek = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        const endOfWeek = new Date(date);
        endOfWeek.setDate(date.getDate() + (6 - date.getDay()));
        return endOfWeek.toISOString().split('T')[0];
    } catch (error) {
        console.error('Error getting end of week:', error);
        return dateString;
    }
};

/**
 * Validates a date string format (YYYY-MM-DD)
 */
export const validateDateString = (dateString: string): boolean => {
    try {
        if (!dateString || typeof dateString !== 'string') {
            return false;
        }

        // Check format YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateString)) {
            return false;
        }

        // Check if it's a valid date
        const date = new Date(dateString);
        return !isNaN(date.getTime()) && dateString === date.toISOString().split('T')[0];
    } catch (error) {
        return false;
    }
};

/**
 * Gets relative time string (e.g., "2 days ago", "in 3 hours")
 */
export const getRelativeTimeString = (
    dateString: string,
    options: RelativeTimeOptions = {}
): string => {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        const { includeSeconds = false, shortFormat = false } = options;

        const intervals = [
            {
                label: shortFormat ? 'y' : 'year',
                labelPlural: shortFormat ? 'y' : 'years',
                seconds: 31536000
            },
            {
                label: shortFormat ? 'mo' : 'month',
                labelPlural: shortFormat ? 'mo' : 'months',
                seconds: 2592000
            },
            {
                label: shortFormat ? 'w' : 'week',
                labelPlural: shortFormat ? 'w' : 'weeks',
                seconds: 604800
            },
            {
                label: shortFormat ? 'd' : 'day',
                labelPlural: shortFormat ? 'd' : 'days',
                seconds: 86400
            },
            {
                label: shortFormat ? 'h' : 'hour',
                labelPlural: shortFormat ? 'h' : 'hours',
                seconds: 3600
            },
            {
                label: shortFormat ? 'm' : 'minute',
                labelPlural: shortFormat ? 'm' : 'minutes',
                seconds: 60
            },
        ];

        if (includeSeconds) {
            intervals.push({
                label: shortFormat ? 's' : 'second',
                labelPlural: shortFormat ? 's' : 'seconds',
                seconds: 1
            });
        }

        const absDiff = Math.abs(diffInSeconds);

        for (const interval of intervals) {
            const count = Math.floor(absDiff / interval.seconds);
            if (count > 0) {
                const unit = count === 1 ? interval.label : interval.labelPlural;
                const prefix = diffInSeconds > 0 ? '' : 'in ';
                const suffix = diffInSeconds > 0 ? (shortFormat ? '' : ' ago') : '';
                return `${prefix}${count}${shortFormat ? '' : ' '}${unit}${suffix}`;
            }
        }

        return shortFormat ? 'now' : 'Just now';
    } catch (error) {
        console.error('Error getting relative time:', error);
        return 'Unknown';
    }
};

/**
 * Gets the weekday name for a date
 */
export const getWeekday = (dateString: string, short: boolean = false): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: short ? 'short' : 'long'
        });
    } catch (error) {
        console.error('Error getting weekday:', error);
        return '';
    }
};

/**
 * Gets the month name for a date
 */
export const getMonthName = (dateString: string, short: boolean = false): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: short ? 'short' : 'long'
        });
    } catch (error) {
        console.error('Error getting month name:', error);
        return '';
    }
};

/**
 * Gets a date range for a specific period
 */
export const getDateRangeForPeriod = (
    period: DatePeriod,
    referenceDate?: string
): DateRange => {
    const reference = referenceDate ? new Date(referenceDate) : new Date();

    switch (period) {
        case 'day':
            const dayStart = reference.toISOString().split('T')[0];
            return { start: dayStart, end: dayStart };

        case 'week':
            return {
                start: getStartOfWeek(reference.toISOString()),
                end: getEndOfWeek(reference.toISOString())
            };

        case 'month':
            return {
                start: getStartOfMonth(reference.toISOString()),
                end: getEndOfMonth(reference.toISOString())
            };

        case 'quarter':
            const quarter = getQuarter(reference.toISOString());
            const quarterStartMonth = (quarter - 1) * 3;
            const quarterStart = new Date(reference.getFullYear(), quarterStartMonth, 1);
            const quarterEnd = new Date(reference.getFullYear(), quarterStartMonth + 3, 0);
            return {
                start: quarterStart.toISOString().split('T')[0],
                end: quarterEnd.toISOString().split('T')[0]
            };

        case 'year':
            return {
                start: getStartOfYear(reference.toISOString()),
                end: getEndOfYear(reference.toISOString())
            };

        default:
            throw new Error(`Unknown period: ${period}`);
    }
};

/**
 * Gets period information with labels
 */
export const getPeriodInfo = (
    period: DatePeriod,
    referenceDate?: string
): DatePeriodInfo => {
    const range = getDateRangeForPeriod(period, referenceDate);
    const days = getDaysBetween(range.start, range.end) + 1;

    const reference = referenceDate ? new Date(referenceDate) : new Date();

    let label: string;
    switch (period) {
        case 'day':
            if (isToday(reference.toISOString())) {
                label = 'Today';
            } else if (isYesterday(reference.toISOString())) {
                label = 'Yesterday';
            } else if (isTomorrow(reference.toISOString())) {
                label = 'Tomorrow';
            } else {
                label = formatDate(reference.toISOString(), 'display');
            }
            break;

        case 'week':
            if (isThisWeek(reference.toISOString())) {
                label = 'This Week';
            } else {
                label = `Week of ${formatDate(range.start, 'display')}`;
            }
            break;

        case 'month':
            if (isThisMonth(reference.toISOString())) {
                label = 'This Month';
            } else {
                label = getMonthName(reference.toISOString()) + ' ' + reference.getFullYear();
            }
            break;

        case 'quarter':
            const quarter = getQuarter(reference.toISOString());
            if (isThisYear(reference.toISOString())) {
                label = `Q${quarter} ${reference.getFullYear()}`;
            } else {
                label = `Q${quarter} ${reference.getFullYear()}`;
            }
            break;

        case 'year':
            if (isThisYear(reference.toISOString())) {
                label = 'This Year';
            } else {
                label = reference.getFullYear().toString();
            }
            break;

        default:
            label = 'Unknown Period';
    }

    return {
        label,
        start: range.start,
        end: range.end,
        days
    };
};

/**
 * Formats a time duration in a human-readable format
 */
export const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);

    return parts.join(' ');
};

/**
 * Gets age in years from a date
 */
export const getAgeInYears = (dateString: string): number => {
    try {
        const birthDate = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    } catch (error) {
        console.error('Error calculating age:', error);
        return 0;
    }
};

/**
 * Checks if a year is a leap year
 */
export const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

/**
 * Gets the number of days in a month
 */
export const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate();
};

/**
 * Converts a date to different timezone
 */
export const convertToTimezone = (
    dateString: string,
    timezone: string = 'UTC'
): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA', { timeZone: timezone });
    } catch (error) {
        console.error('Error converting timezone:', error);
        return dateString;
    }
};

/**
 * Gets common date presets for filtering
 */
export const getDatePresets = (): Record<string, DateRange> => {
    const today = getCurrentDate();

    return {
        today: { start: today, end: today },
        yesterday: {
            start: subtractDays(today, 1),
            end: subtractDays(today, 1)
        },
        thisWeek: getDateRangeForPeriod('week'),
        lastWeek: {
            start: getStartOfWeek(subtractDays(today, 7)),
            end: getEndOfWeek(subtractDays(today, 7))
        },
        thisMonth: getDateRangeForPeriod('month'),
        lastMonth: {
            start: getStartOfMonth(addMonths(today, -1)),
            end: getEndOfMonth(addMonths(today, -1))
        },
        thisQuarter: getDateRangeForPeriod('quarter'),
        thisYear: getDateRangeForPeriod('year'),
        lastYear: {
            start: getStartOfYear(addYears(today, -1)),
            end: getEndOfYear(addYears(today, -1))
        },
        last30Days: {
            start: subtractDays(today, 30),
            end: today
        },
        last90Days: {
            start: subtractDays(today, 90),
            end: today
        },
        last365Days: {
            start: subtractDays(today, 365),
            end: today
        }
    };
};