import '@testing-library/jest-dom';
import Permissions from './SetPermissionsEditor';
import { render } from 'utils/tests.js';
import { DecodedCall } from '../../types';
import { SupportedAction } from '../../types';
import ERC20Guild from 'contracts/ERC20Guild.json';
import { BigNumber, utils } from 'ethers';
import { ANY_FUNC_SIGNATURE, ANY_ADDRESS, MAX_UINT } from 'utils';
import { fireEvent, screen } from '@testing-library/react';
import { mockChain } from 'Components/Web3Modals/fixtures';

// Mocked hooks

jest.mock('hooks/Guilds/ether-swr/ens/useENSAvatar', () => ({
  __esModule: true,
  default: () => ({
    avatarUri: 'test',
    imageUrl: 'test',
    ensName: 'test.eth',
  }),
}));

jest.mock('hooks/Guilds/ether-swr/useEtherSWR.ts', () => ({
  __esModule: true,
  default: () => ({
    getNetwork: 'eth',
  }),
}));

jest.mock('wagmi', () => ({
  useAccount: () => ({ isConnected: false }),
  useNetwork: () => ({ chain: mockChain, chains: [mockChain] }),
}));

// Mocked variables

const ERC20GuildContract = new utils.Interface(ERC20Guild.abi);

const functionNameMock = 'test';
const functionSignatureMock = '0x9c22ff5f';
const toAddressMock = '0x79706C8e413CDaeE9E63f282507287b9Ea9C0928';
const customAmountMock = 111;
const tokenAddresMock = '0xD899Be87df2076e0Be28486b60dA406Be6757AfC';

const emptyDecodedCallMock: DecodedCall = {
  from: '',
  callType: SupportedAction.REP_MINT,
  function: ERC20GuildContract.getFunction('setPermission'),
  to: '0xD899Be87df2076e0Be28486b60dA406Be6757AfC',
  value: BigNumber.from(0),
  args: {
    to: [ANY_ADDRESS],
    functionSignature: [ANY_FUNC_SIGNATURE],
    valueAllowed: [BigNumber.from(0)],
    allowance: ['true'],
  },
  optionalProps: {
    asset: '',
    functionName: '',
    tab: 0,
  },
};

const completeDecodedCallMock: DecodedCall = {
  from: '',
  callType: SupportedAction.REP_MINT,
  function: ERC20GuildContract.getFunction('setPermission'),
  to: '0xD899Be87df2076e0Be28486b60dA406Be6757AfC',
  value: BigNumber.from(0),
  args: {
    to: [toAddressMock],
    functionSignature: [functionSignatureMock],
    valueAllowed: [BigNumber.from('111000000000000000000')],
    allowance: ['true'],
  },
  optionalProps: {
    asset: tokenAddresMock,
    functionName: functionNameMock,
    tab: 1,
  },
};

describe(`Set Permissions editor`, () => {
  describe(`Asset transfer tests`, () => {
    beforeAll(() => {});
    it.skip(`Default view renders asset transfer`, () => {
      render(
        <Permissions decodedCall={emptyDecodedCallMock} onSubmit={jest.fn()} />
      );

      expect(
        screen.getByRole('textbox', { name: /asset picker/i })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('textbox', { name: /to address input/i })
      ).toBeInTheDocument();

      expect(screen.getByRole('switch', { name: /toggle any address/i }));

      expect(
        screen.getByRole('textbox', { name: /amount input/i })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('switch', { name: /toggle max value/i })
      ).toBeInTheDocument();
    });

    it.skip(`Can fill 'To address' and 'custom amount'`, () => {
      render(
        <Permissions decodedCall={emptyDecodedCallMock} onSubmit={jest.fn()} />
      );
      const toAddressElement: HTMLInputElement = screen.getByRole('textbox', {
        name: /to address input/i,
      });
      fireEvent.change(toAddressElement, { target: { value: toAddressMock } });

      const customAmountElement: HTMLInputElement = screen.getByRole(
        'textbox',
        {
          name: /amount input/i,
        }
      );
      fireEvent.change(customAmountElement, {
        target: { value: customAmountMock },
      });

      expect(toAddressElement.value).toBe(toAddressMock);
      expect(customAmountElement.value).toBe('111.0');
    });

    it.skip(`Clicking the X clears the to address`, () => {
      render(
        <Permissions decodedCall={emptyDecodedCallMock} onSubmit={jest.fn()} />
      );

      const addressToggle = screen.getByRole('switch', {
        name: /toggle any address/i,
      });
      fireEvent.click(addressToggle);

      const toAddressElement: HTMLInputElement = screen.getByRole('textbox', {
        name: /to address input/i,
      });
      fireEvent.change(toAddressElement, { target: { value: toAddressMock } });

      const clearInputIcon = screen.getByLabelText('clear address');
      fireEvent.click(clearInputIcon);

      expect(toAddressElement.value).toBe('');
    });

    it(`Displays decodedCall information properly`, () => {
      render(
        <Permissions
          decodedCall={completeDecodedCallMock}
          onSubmit={jest.fn()}
        />
      );

      const toAddressElement: HTMLInputElement = screen.getByRole('textbox', {
        name: /to address input/i,
      });

      const amountInputElement: HTMLInputElement = screen.getByRole('textbox', {
        name: /amount input/i,
      });

      expect(toAddressElement.value).toBe(completeDecodedCallMock.args.to[0]);
      expect(amountInputElement.value).toBe('111.0');
    });

    it.skip(`Toggling max amount disables the 'amount' input`, () => {
      render(
        <Permissions decodedCall={emptyDecodedCallMock} onSubmit={jest.fn()} />
      );

      const amountInput: HTMLInputElement = screen.getByRole('textbox', {
        name: /amount input/i,
      });
      const toggleMaxValueElement = screen.getByRole('switch', {
        name: /toggle max value/i,
      });

      fireEvent.click(toggleMaxValueElement);
      expect(amountInput).toBeDisabled();
    });

    it.skip(`Amount input should preserve its temporary value after toggle is off/on`, () => {
      render(
        <Permissions decodedCall={emptyDecodedCallMock} onSubmit={jest.fn()} />
      );

      const customAmountElement: HTMLInputElement = screen.getByRole(
        'textbox',
        {
          name: /amount input/i,
        }
      );
      fireEvent.change(customAmountElement, {
        target: { value: customAmountMock },
      });

      const toggleMaxValueElement = screen.getByRole('switch', {
        name: /toggle max value/i,
      });

      // Asserts value is maintaned when disabled and enabled again
      fireEvent.click(toggleMaxValueElement);
      const stringAmount = BigNumber.from(MAX_UINT).toString();
      const expectedMaxValue = stringAmount.replace(
        new RegExp('.{' + (stringAmount.length - 18) + '}'),
        `$&.`
      ); // adds trailing nums after decimal point
      expect(customAmountElement.value).toBe(expectedMaxValue);
      fireEvent.click(toggleMaxValueElement);
      expect(customAmountElement.value).toBe('111.0');
    });
  });

  describe(`Function calls tests`, () => {
    it(`Can fill the 'to address', 'function signature' and amount`, () => {
      render(
        <Permissions decodedCall={emptyDecodedCallMock} onSubmit={jest.fn()} />
      );
      const functionsCallTab = screen.getByTestId(`functions-call-tab`);
      fireEvent.click(functionsCallTab);

      const toAddressElement: HTMLInputElement = screen.getByRole('textbox', {
        name: /to address input/i,
      });
      fireEvent.change(toAddressElement, {
        target: { value: toAddressMock },
      });

      const functionSignatureElement: HTMLInputElement = screen.getByRole(
        'textbox',
        { name: /function signature input/i }
      );
      fireEvent.change(functionSignatureElement, {
        target: { value: functionNameMock },
      });

      const amountElement: HTMLInputElement = screen.getByRole('textbox', {
        name: /amount input/i,
      });
      fireEvent.change(amountElement, {
        target: { value: customAmountMock },
      });

      expect(toAddressElement.value).toBe(toAddressMock);
      expect(functionSignatureElement.value).toBe(functionNameMock);
      expect(amountElement.value).toBe('111.0');
    });

    it(`Displays decodedCall information properly`, () => {
      render(
        <Permissions
          decodedCall={completeDecodedCallMock}
          onSubmit={jest.fn()}
        />
      );
      const functionsCallTab = screen.getByTestId(`functions-call-tab`);
      fireEvent.click(functionsCallTab);

      const toAddressElement: HTMLInputElement = screen.getByRole('textbox', {
        name: /to address input/i,
      });

      const functionNameElement: HTMLInputElement = screen.getByRole(
        'textbox',
        { name: /function signature input/i }
      );

      expect(toAddressElement.value).toBe(completeDecodedCallMock.args.to[0]);
      expect(functionNameElement.value).toBe(functionNameMock);
    });
  });

  describe(`Tab interaction`, () => {
    it(`Changing tabs to function calls shows its elements`, () => {
      render(
        <Permissions decodedCall={emptyDecodedCallMock} onSubmit={jest.fn()} />
      );

      const functionsCallTab = screen.getByTestId(`functions-call-tab`);
      fireEvent.click(functionsCallTab);

      expect(
        screen.getByRole('textbox', { name: /to address input/i })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('textbox', { name: /function signature input/i })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('textbox', { name: /amount input/i })
      ).toBeInTheDocument();
    });

    it(`'To address' persists when changing tabs`, () => {});
    it(`'Asset' and 'amount' persists when switching tabs`, () => {});
    it(`'Toggle max value' persist when switching tabs`, () => {});
  });
});
