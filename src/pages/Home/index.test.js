import { screen } from '@testing-library/react'
import {render} from '../../utils/test'
import Home from './'

describe('The Home component', () => {
  it('should render title', () => {
    render(
        <Home />
    )
    expect(
      screen.getByRole('heading', {
        level: 2,
        text: 'Repérez vos besoins, on s’occupe du reste, avec les meilleurs talents',
      })
    ).toBeTruthy()
  })
})
