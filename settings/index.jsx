const KEY_LANG = 'language';
const KEY_DIST = 'distance';
const KEY_TIME = 'time';
const KEY_DATE = 'date';

function SetProperties(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Language</Text>}>
        <Select
  label={`Select language`}
  settingsKey={KEY_LANG}
  options={[
    {name:'Fitbit account', value:'*'},
    {name:'Danish', value:'dk'},
    {name:'Dutch', value:'nl'},
    {name:'English', value:'en'},
    {name:'Finnish', value:'fi'},
    {name:'French', value:'fr'},
    {name:'German', value:'de'},
    {name:'Italian', value:'it'},
    {name:'Norwegian', value:'no'},
    {name:'Spanish', value:'es'},
    {name:'Swedish', value:'sv'}
  ]}
/>
      </Section>
      <Section
        title={<Text bold align="center">Distance unit</Text>}>
        <Select
  label={`Select distance unit`}
  settingsKey={KEY_DIST}
  options={[
    {name:'Fitbit account', value:'*'},
    {name:'Kilometres', value:'metric'},
    {name:'Miles', value:'us'}
  ]}
/>
      </Section>
      <Section
        title={<Text bold align="center">Time format</Text>}>
        <Select
  label={`Select time format`}
  settingsKey={KEY_TIME}
  options={[
    {name:'Fitbit account', value:'*'},
    {name:'12 hours', value:'12h'},
    {name:'24 hours', value:'24h'}
  ]}
/>
      </Section>
      <Section
        title={<Text bold align="center">Date format</Text>}>
        <Select
  label={`Select date format`}
  settingsKey={KEY_DATE}
  options={[
    {name:'dd.mm.yyyy', value:'dmy.'},
    {name:'dd/mm/yyyy', value:'dmy/'},
    {name:'mm.dd.yyyy', value:'mdy.'},
    {name:'mm/dd/yyyy', value:'mdy/'}
  ]}
/>
      </Section>
    </Page>
  );}

registerSettingsPage(SetProperties);
