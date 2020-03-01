import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  WeekWrapper,
  WeekdaysWrapper,
  WeekHeader,
  DaysWrapper
} from './styles';

const daysInitial = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

class WeekDaypicker extends React.Component {
  constructor(props) {
    super(props);
    const { initDay } = props;
    const startDate = initDay ? moment(initDay) : moment();

    this.onNextClick = this.onNextClick.bind(this);
    this.onPrevClick = this.onPrevClick.bind(this);

    this.state = {
      startDate,
      selectedDate: initDay || moment()
    };
  }

  onDateClick(selectedDate) {
    const { onChange } = this.props;
    this.setState(
      {
        selectedDate
      },
      () => {
        onChange(selectedDate);
      }
    );
  }

  onNextClick() {
    const { startDate } = this.state;
    const { onWeekChange } = this.props;
    this.setState(
      {
        startDate: startDate.add(7, 'd')
      },
      () => {
        onWeekChange(startDate);
      }
    );
  }

  onPrevClick() {
    const { startDate } = this.state;
    const { onWeekChange } = this.props;
    this.setState(
      {
        startDate: startDate.subtract(7, 'd')
      },
      () => {
        onWeekChange(startDate);
      }
    );
  }

  renderWeekDays() {
    const { locale, workingWeek } = this.props;
    const days = [];
    const m = moment().locale(locale);
    for (let i = workingWeek ? 1 : 0; i < (workingWeek ? 6 : 7); i++) {
      days.push(<li key={`weekday-${i % 7}`}>{daysInitial[m.day(i % 7).format("d")]}</li>);
    }
    return days;
  }

  renderDays() {
    const { workingWeek } = this.props;
    const { startDate, selectedDate } = this.state;
    const days = [];
    for (let i = workingWeek ? 1 : 0; i < (workingWeek ? 6 : 7); i++) {
      const date = startDate.clone().add(i, 'd');
      days.push(
        <button
          type="button"
          key={`day-${i}`}
          className={`day ${date.isSame(selectedDate, 'd') ? 'active' : ''}`}
          onClick={() => {
            this.onDateClick(date);
          }}
        >
          {date.format('DD')}
        </button>
      );
    }
    return days;
  }

  render() {
    let { startDate } = this.state;
    const { locale, workingWeek, theme } = this.props;
    startDate.locale(locale);
    if (workingWeek) {
      startDate = startDate.clone().day(workingWeek ? 1 : 0);
    }
    const endDate = startDate.clone().day(workingWeek ? 5 : 6);
    const headerLabel = `${startDate.format('DD')}-${endDate.format(
      'DD'
    )} ${endDate.format('MMM')} ${endDate.format('YYYY')}`;
    return (
      <WeekWrapper theme={theme}>
        <WeekHeader theme={theme}>
          <button type="button" className="prev" onClick={this.onPrevClick}>
            Prev
          </button>
          <button type="button" className="next" onClick={this.onNextClick}>
            Next
          </button>
          <p className="title">{headerLabel}</p>
        </WeekHeader>
        <WeekdaysWrapper theme={theme}>{this.renderWeekDays()}</WeekdaysWrapper>
        <DaysWrapper theme={theme}>{this.renderDays()}</DaysWrapper>
      </WeekWrapper>
    );
  }
}

WeekDaypicker.propTypes = {
  workingWeek: PropTypes.bool,
  locale: PropTypes.string,
  onChange: PropTypes.func,
  onWeekChange: PropTypes.func,
  initDay: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(moment),
    PropTypes.instanceOf(Date)
  ]),
  theme: PropTypes.shape({
    dayColor: PropTypes.string,
    dayBackground: PropTypes.string,
    weekdayColor: PropTypes.string,
    daySelectedColor: PropTypes.string,
    daySelectedBackground: PropTypes.string
  })
};

WeekDaypicker.defaultProps = {
  workingWeek: false,
  locale: 'en',
  theme: {
    wrapperBackground: 'transparent',
    titleColor: '#000',
    dayColor: '#222222',
    dayBackground: 'transparent',
    weekdayColor: '#aaaaaa',
    daySelectedColor: '#fff',
    daySelectedBackground: '#3434ff'
  },
  onChange: () => {},
  initDay: null,
  markedDays: [],
  onWeekChange: () => {}
};

export default WeekDaypicker;
