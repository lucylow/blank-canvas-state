import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useWeb3 } from '@/contexts/Web3Context';
import { Wallet, CreditCard, ArrowRight, Lock, CheckCircle2, Info, ExternalLink, Loader2 } from 'lucide-react';

interface Domain {
  name: string;
  price: string;
  currency: string;
}

interface HybridPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domain: Domain | null;
}

export const HybridPaymentModal: React.FC<HybridPaymentModalProps> = ({
  open,
  onOpenChange,
  domain
}) => {
  const { toast } = useToast();
  const { isConnected, connectWallet, account } = useWeb3();
  const [paymentMethod, setPaymentMethod] = useState<'web3' | 'web2' | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');
  
  // Web2 form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const ETH_TO_USD = 3500;
  const PLATFORM_FEE = 0.02;
  const GATEWAY_FEE = 0.015;

  const calculateWeb2Pricing = () => {
    if (!domain) return null;
    const ethPrice = parseFloat(domain.price);
    const subtotal = ethPrice * ETH_TO_USD;
    const platformFee = subtotal * PLATFORM_FEE;
    const gatewayFee = subtotal * GATEWAY_FEE;
    const total = subtotal + platformFee + gatewayFee;

    return {
      subtotal: subtotal.toFixed(2),
      platformFee: platformFee.toFixed(2),
      gatewayFee: gatewayFee.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const handleWeb3Payment = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }
    
    setProcessing(true);
    
    // Simulate Web3 transaction
    setTimeout(() => {
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
      setTxHash(mockTxHash);
      setProcessing(false);
      setSuccess(true);
      
      toast({
        title: "🎉 Transaction Successful!",
        description: `${domain?.name} NFT transferred to your wallet`,
      });
      
      setTimeout(() => {
        onOpenChange(false);
        resetModal();
      }, 3000);
    }, 2500);
  };

  const handleWeb2Payment = async () => {
    if (!cardNumber || !expiry || !cvv || !cardName || !billingAddress || !agreeTerms || !userEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all payment details and accept the terms",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing with backend flow
    setTimeout(() => {
      const mockTxId = 'TXN-DL-' + new Date().toISOString().split('T')[0].replace(/-/g, '') + '-WEB2-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      setTxHash(mockTxId);
      setProcessing(false);
      setSuccess(true);
      
      toast({
        title: "🎉 Congratulations! Your purchase is complete!",
        description: `${domain?.name} NFT has been transferred to your DomaLand.AI wallet. Check ${userEmail} for confirmation details.`,
      });
      
      setTimeout(() => {
        onOpenChange(false);
        resetModal();
      }, 4000);
    }, 3000);
  };

  const resetModal = () => {
    setPaymentMethod(null);
    setSuccess(false);
    setTxHash('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setCardName('');
    setBillingAddress('');
    setUserEmail('');
    setAgreeTerms(false);
  };

  if (!domain) return null;

  const pricing = calculateWeb2Pricing();

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetModal();
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {success ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                Purchase Complete!
              </>
            ) : (
              <>Acquire {domain.name}</>
            )}
          </DialogTitle>
          <DialogDescription>
            {!success && !paymentMethod && 'Choose your preferred payment method to acquire this tokenized domain'}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="space-y-4">
            <Card className="border-green-500/50 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="pt-6 text-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-24 w-24 bg-green-500/20 rounded-full animate-pulse"></div>
                  </div>
                  <CheckCircle2 className="h-20 w-20 text-green-600 mx-auto relative z-10 animate-bounce-in" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-green-900">
                    🎉 Congratulations!
                  </h3>
                  <p className="text-green-700 text-lg">
                    Your purchase of <strong className="font-bold">{domain.name}</strong> is complete!
                  </p>
                </div>

                <Alert className="bg-white/50 border-green-500/30">
                  <Info className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-sm text-green-800">
                    The domain NFT has been transferred to your DomaLand.AI wallet.
                    {paymentMethod === 'web2' && userEmail && (
                      <> A confirmation email has been sent to <strong>{userEmail}</strong>.</>
                    )}
                  </AlertDescription>
                </Alert>

                {txHash && (
                  <div className="bg-white/50 rounded-lg p-4 space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">Transaction ID:</p>
                    <div className="flex items-center justify-between gap-2 bg-muted/50 rounded px-3 py-2">
                      <code className="text-xs font-mono text-foreground">{txHash}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          if (paymentMethod === 'web3') {
                            window.open(`https://etherscan.io/tx/${txHash}`, '_blank');
                          }
                        }}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  <Button 
                    onClick={() => {
                      onOpenChange(false);
                      resetModal();
                    }}
                    className="w-full"
                  >
                    View My Portfolio
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {paymentMethod === 'web2' 
                      ? 'You can connect a non-custodial wallet anytime to take full control of your assets.'
                      : 'Your domain is now secured on the blockchain.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : !paymentMethod ? (
          <div className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>DomaLand.AI Hybrid Payment System:</strong> Bridge Web2 and Web3 seamlessly. 
                Purchase tokenized domains using traditional payment methods or cryptocurrency.
              </AlertDescription>
            </Alert>

            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Domain:</span>
                <span className="font-semibold">{domain.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Listed Price:</span>
                <span className="font-semibold text-lg">{domain.price} {domain.currency}</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card 
                className="cursor-pointer hover:border-primary transition-all hover:shadow-md"
                onClick={() => setPaymentMethod('web3')}
              >
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Wallet className="h-8 w-8 text-primary" />
                    <Badge variant="outline" className="bg-primary/10">Web3</Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Pay with Crypto</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Use ETH, USDC, or other supported tokens
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground">
                      ✓ Requires Web3 wallet connection
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ✓ Lower fees
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ✓ Direct blockchain ownership
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:border-primary transition-all hover:shadow-md"
                onClick={() => setPaymentMethod('web2')}
              >
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <CreditCard className="h-8 w-8 text-primary" />
                    <Badge variant="outline" className="bg-secondary/10">Web2</Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Pay with Card</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Credit card, debit card, or bank transfer
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground">
                      ✓ No crypto wallet needed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ✓ Traditional payment method
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ✓ Custodial wallet provided
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : paymentMethod === 'web3' ? (
          <div className="space-y-6">
            <Alert className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <Wallet className="h-4 w-4 text-primary" />
              <AlertDescription>
                <strong>Web3 Payment Flow:</strong> Connect your wallet to complete this purchase directly on the blockchain.
                Your domain NFT will be transferred immediately upon confirmation.
              </AlertDescription>
            </Alert>

            <Card className="bg-gradient-to-br from-card to-muted/20">
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Domain:</span>
                  <span className="font-semibold">{domain.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Listed Price:</span>
                  <span className="font-semibold text-lg">{domain.price} {domain.currency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Network:</span>
                  <Badge variant="outline">Ethereum Mainnet</Badge>
                </div>
                {isConnected && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Connected Wallet:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {account?.slice(0, 6)}...{account?.slice(-4)}
                    </code>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold">Total (No Fees):</span>
                  <span className="font-bold text-primary">{domain.price} {domain.currency}</span>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Doma Protocol Integration:</strong> This transaction will be executed via the Doma Protocol marketplace smart contract,
                ensuring trustless and secure domain ownership transfer.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setPaymentMethod(null)}
                disabled={processing}
              >
                Back
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleWeb3Payment} 
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isConnected ? (
                  <>
                    Confirm Purchase
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Connect Wallet
                    <Wallet className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Alert className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                <strong>Web2 to Web3 Bridge:</strong> DomaLand.AI handles fiat-to-crypto conversion and blockchain transactions.
                You'll receive domain ownership without managing crypto yourself!
              </AlertDescription>
            </Alert>

            <Card className="bg-gradient-to-br from-muted/50 to-muted/20 border-border/50">
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Domain:</span>
                  <span className="font-semibold">{domain.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Listed Price:</span>
                  <span className="font-semibold">{domain.price} {domain.currency}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Exchange Rate:</span>
                  <span className="font-semibold">1 ETH = ${ETH_TO_USD.toLocaleString()} USD</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${pricing?.subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Platform Fee (2%):</span>
                  <span>${pricing?.platformFee}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Payment Gateway Fee (1.5%):</span>
                  <span>${pricing?.gatewayFee}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold">Total Due:</span>
                  <span className="font-bold text-primary">${pricing?.total} USD</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>Secure Payment Processing</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  PCI DSS Compliant
                </Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane.doe@example.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Confirmation and ownership details will be sent here
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                  <Input
                    id="expiry"
                    placeholder="12/27"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input
                  id="cardName"
                  placeholder="Jane Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="billing">Billing Address</Label>
                <Input
                  id="billing"
                  placeholder="123 Main St, Anytown, USA"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  I agree to the Terms & Conditions
                </label>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-xs text-blue-800 space-y-2">
                <p><strong>How it works:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Your payment is processed securely via Stripe</li>
                  <li>DomaLand.AI converts fiat to crypto on your behalf</li>
                  <li>The Doma Protocol smart contract executes the domain transfer</li>
                  <li>Domain NFT is minted/transferred to your custodial wallet</li>
                </ol>
                <p className="pt-2 text-xs">
                  ✓ You can export to a non-custodial wallet anytime
                </p>
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setPaymentMethod(null)}
                disabled={processing}
              >
                Back
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600" 
                onClick={handleWeb2Payment} 
                disabled={processing || !agreeTerms}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    Confirm Web2 Payment (${pricing?.total} USD)
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
